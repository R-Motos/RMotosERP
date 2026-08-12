from decimal import Decimal
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.purchase_receipt import RecepcionCompra, RecepcionCompraDetalle
from app.models.purchase_order import OrdenCompra, OrdenCompraDetalle
from app.models.product import Producto
from app.models.supplier import Proveedor
from app.models.user import User
from app.services import inventory_movement_service, financial_movement_service, audit_service


def _get_cantidad_recibida(db: Session, orden_detalle_id: int) -> Decimal:
    orden_detalle = db.query(OrdenCompraDetalle).filter(OrdenCompraDetalle.id == orden_detalle_id).first()
    if not orden_detalle:
        return Decimal('0')
    
    recibido = db.query(func.coalesce(func.sum(RecepcionCompraDetalle.cantidad_recibida), Decimal('0'))).join(
        RecepcionCompra, RecepcionCompraDetalle.recepcion_id == RecepcionCompra.id
    ).filter(
        RecepcionCompraDetalle.producto_id == orden_detalle.producto_id,
        RecepcionCompra.orden_compra_id == orden_detalle.orden_id,
    ).scalar()
    
    return recibido or Decimal('0')


def _actualizar_estado_orden(db: Session, orden_id: int):
    orden = db.query(OrdenCompra).filter(OrdenCompra.id == orden_id).first()
    if not orden:
        return
    
    detalles = db.query(OrdenCompraDetalle).filter(OrdenCompraDetalle.orden_id == orden_id).all()
    total_orden = sum(detalle.cantidad for detalle in detalles)
    total_recibido = Decimal('0')
    
    for detalle in detalles:
        recibido = db.query(func.coalesce(func.sum(RecepcionCompraDetalle.cantidad_recibida), Decimal('0'))).join(
            RecepcionCompra, RecepcionCompraDetalle.recepcion_id == RecepcionCompra.id
        ).filter(
            RecepcionCompraDetalle.producto_id == detalle.producto_id,
            RecepcionCompra.orden_compra_id == orden_id,
        ).scalar() or Decimal('0')
        total_recibido += recibido
    
    if total_recibido >= total_orden and total_orden > 0:
        orden.estado = 'completada'
    elif total_recibido > 0:
        orden.estado = 'parcialmente_recibida'
    
    db.commit()


def create(db: Session, orden_compra_id: int, proveedor_id: int, usuario_id: int, detalles_data: list[dict], observaciones: str | None = None, estado: str = 'pendiente') -> RecepcionCompra:
    orden = db.query(OrdenCompra).filter(OrdenCompra.id == orden_compra_id).first()
    if not orden:
        raise ValueError('Orden de compra no encontrada')
    
    if orden.estado in ('completada', 'cancelada'):
        raise ValueError('No se puede recibir mercancía de una orden completada o cancelada')
    
    proveedor = db.get(Proveedor, proveedor_id)
    if not proveedor:
        raise ValueError('Proveedor no encontrado')
    
    usuario = db.get(User, usuario_id)
    if not usuario:
        raise ValueError('Usuario no encontrado')
    
    if not detalles_data:
        raise ValueError('La recepción debe tener al menos un producto')
    
    orden_detalles = {d.producto_id: d for d in db.query(OrdenCompraDetalle).filter(OrdenCompraDetalle.orden_id == orden_compra_id).all()}
    
    for detalle_data in detalles_data:
        producto_id = detalle_data['producto_id']
        if producto_id not in orden_detalles:
            raise ValueError('Producto no pertenece a la orden')
        
        orden_detalle = orden_detalles[producto_id]
        recibido_actual = db.query(func.coalesce(func.sum(RecepcionCompraDetalle.cantidad_recibida), Decimal('0'))).join(
            RecepcionCompra, RecepcionCompraDetalle.recepcion_id == RecepcionCompra.id
        ).filter(
            RecepcionCompraDetalle.producto_id == producto_id,
            RecepcionCompra.orden_compra_id == orden_compra_id,
        ).scalar() or Decimal('0')
        
        pendiente = orden_detalle.cantidad - recibido_actual
        if detalle_data['cantidad_recibida'] > pendiente:
            raise ValueError(f'Cantidad excede el pendiente para el producto {producto_id}')
    
    recepcion = RecepcionCompra(
        orden_compra_id=orden_compra_id,
        proveedor_id=proveedor_id,
        usuario_id=usuario_id,
        estado=estado,
        observaciones=observaciones,
    )
    db.add(recepcion)
    db.flush()
    
    for detalle_data in detalles_data:
        detalle = RecepcionCompraDetalle(
            recepcion_id=recepcion.id,
            producto_id=detalle_data['producto_id'],
            cantidad_recibida=detalle_data['cantidad_recibida'],
            precio_unitario=detalle_data['precio_unitario'],
        )
        db.add(detalle)
        
        inventory_movement_service.create(
            db,
            producto_id=detalle_data['producto_id'],
            tipo='entrada',
            cantidad=detalle_data['cantidad_recibida'],
            usuario_id=usuario_id,
            observaciones=observaciones,
            referencia=f'recepcion_compra_{recepcion.id}',
        )
    
    db.commit()
    db.refresh(recepcion)
    
    if estado == 'completada':
        total_recepcion = sum(d['cantidad_recibida'] * d['precio_unitario'] for d in detalles_data)
        financial_movement_service.create_movimiento(
            db,
            tipo='egreso',
            concepto='Compra proveedor',
            descripcion=observaciones,
            monto=total_recepcion,
            fecha=recepcion.fecha,
            origen='compra',
            referencia_id=recepcion.id,
            usuario_id=usuario_id,
        )
    
    audit_service.log(
        db,
        usuario_id=usuario_id,
        modulo='recepciones_compra',
        accion='crear',
        registro_id=recepcion.id,
        descripcion=f'Recepción de compra {recepcion.id} creada',
        datos_nuevos={'id': recepcion.id, 'orden_compra_id': recepcion.orden_compra_id, 'estado': recepcion.estado},
    )
    
    _actualizar_estado_orden(db, orden_compra_id)
    
    return recepcion


def get(db: Session, recepcion_id: int) -> RecepcionCompra | None:
    return db.query(RecepcionCompra).filter(RecepcionCompra.id == recepcion_id).first()


def list(db: Session, estado: str | None = None) -> list[RecepcionCompra]:
    query = db.query(RecepcionCompra)
    if estado:
        query = query.filter(RecepcionCompra.estado == estado)
    return query.order_by(RecepcionCompra.created_at.desc()).all()
