from datetime import datetime
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.sale import Venta, VentaDetalle
from app.models.product import Producto
from app.models.client import Cliente
from app.models.user import User
from app.services import inventory_movement_service, financial_movement_service, audit_service


ESTADOS_INMODIFICABLES = {'anulada'}


def _generar_numero(db: Session) -> str:
    ultima = db.query(Venta).order_by(Venta.id.desc()).first()
    if ultima:
        try:
            ultimo_numero = int(ultima.numero.split('-')[-1])
        except (ValueError, IndexError):
            ultimo_numero = 0
    else:
        ultimo_numero = 0
    return f'V-{ultimo_numero + 1:05d}'


def create(db: Session, usuario_id: int, cliente_id: int | None, metodo_pago: str, detalles_data: list[dict], estado: str = 'completada', descuento: Decimal = Decimal('0')) -> Venta:
    usuario = db.get(User, usuario_id)
    if not usuario:
        raise ValueError('Usuario no encontrado')

    if cliente_id is not None:
        cliente = db.get(Cliente, cliente_id)
        if not cliente:
            raise ValueError('Cliente no encontrado')

    if not detalles_data:
        raise ValueError('La venta debe tener al menos un producto')

    productos_vistos = set()
    subtotal = Decimal('0')
    detalles = []

    for detalle_data in detalles_data:
        producto_id = detalle_data['producto_id']
        if producto_id in productos_vistos:
            raise ValueError('Producto repetido en la venta')
        productos_vistos.add(producto_id)

        producto = db.get(Producto, producto_id)
        if not producto:
            raise ValueError('Producto no encontrado')

        cantidad = detalle_data['cantidad']
        if cantidad <= 0:
            raise ValueError('La cantidad debe ser mayor a 0')

        if producto.cantidad_disponible < cantidad:
            raise ValueError(f'Stock insuficiente para el producto {producto_id}')

        precio_unitario = detalle_data['precio_unitario']
        descuento_linea = detalle_data.get('descuento', Decimal('0'))
        subtotal_linea = cantidad * precio_unitario - descuento_linea
        subtotal += subtotal_linea

        detalles.append(VentaDetalle(
            producto_id=producto_id,
            cantidad=cantidad,
            precio_unitario=precio_unitario,
            descuento=descuento_linea,
            subtotal=subtotal_linea,
        ))

    total = subtotal - descuento
    if total < 0:
        raise ValueError('El total no puede ser negativo')

    numero = _generar_numero(db)
    venta = Venta(
        numero=numero,
        usuario_id=usuario_id,
        cliente_id=cliente_id,
        estado=estado,
        subtotal=subtotal,
        descuento=descuento,
        total=total,
        metodo_pago=metodo_pago,
    )
    db.add(venta)
    db.flush()

    for detalle in detalles:
        detalle.venta_id = venta.id
        db.add(detalle)

        if estado == 'completada':
            inventory_movement_service.create(
                db,
                producto_id=detalle.producto_id,
                tipo='salida',
                cantidad=detalle.cantidad,
                usuario_id=usuario_id,
                observaciones=f'Venta {venta.numero}',
                referencia=f'venta_{venta.id}',
            )

    if estado == 'completada':
        financial_movement_service.create_movimiento(
            db,
            tipo='ingreso',
            concepto=f'Venta {venta.numero}',
            descripcion=None,
            monto=venta.total,
            fecha=venta.fecha_venta,
            origen='venta',
            referencia_id=venta.id,
            usuario_id=usuario_id,
        )

        if cliente_id is not None and cliente:
            cliente.cantidad_compras = (cliente.cantidad_compras or 0) + 1
            cliente.total_gastado = (cliente.total_gastado or 0) + total

    audit_service.log(
        db,
        usuario_id=usuario_id,
        modulo='ventas',
        accion='crear',
        registro_id=venta.id,
        descripcion=f'Venta {venta.numero} creada',
        datos_nuevos={'id': venta.id, 'numero': venta.numero, 'total': str(venta.total)},
    )

    db.commit()
    db.refresh(venta)
    return venta


def anular(db: Session, venta_id: int) -> Venta | None:
    venta = db.query(Venta).filter(Venta.id == venta_id).first()
    if not venta:
        raise ValueError('Venta no encontrada')

    if venta.estado in ESTADOS_INMODIFICABLES:
        raise ValueError('No se puede modificar una venta anulada')

    if venta.estado == 'anulada':
        raise ValueError('La venta ya está anulada')

    for detalle in venta.detalles:
        producto = db.get(Producto, detalle.producto_id)
        if producto:
            inventory_movement_service.create(
                db,
                producto_id=detalle.producto_id,
                tipo='entrada',
                cantidad=detalle.cantidad,
                usuario_id=venta.usuario_id,
                observaciones=f'Anulación venta {venta.numero}',
                referencia=f'venta_anulada_{venta.id}',
            )

    venta.estado = 'anulada'
    if venta.cliente_id:
        cliente = db.get(Cliente, venta.cliente_id)
        if cliente:
            cliente.cantidad_compras = max(0, (cliente.cantidad_compras or 0) - 1)
            cliente.total_gastado = max(0, (cliente.total_gastado or 0) - venta.total)
    db.commit()
    db.refresh(venta)

    audit_service.log(
        db,
        usuario_id=venta.usuario_id,
        modulo='ventas',
        accion='anular',
        registro_id=venta.id,
        descripcion=f'Venta {venta.numero} anulada',
        datos_anteriores={'estado': 'completada'},
        datos_nuevos={'estado': 'anulada'},
    )

    return venta


def get(db: Session, venta_id: int) -> Venta | None:
    return db.query(Venta).filter(Venta.id == venta_id).first()


def list(db: Session, estado: str | None = None, fecha_inicio: datetime | None = None, fecha_fin: datetime | None = None, usuario_id: int | None = None) -> tuple[list[Venta], Decimal]:
    query = db.query(Venta)

    if estado:
        query = query.filter(Venta.estado == estado)

    if fecha_inicio:
        query = query.filter(Venta.fecha_venta >= fecha_inicio)

    if fecha_fin:
        query = query.filter(Venta.fecha_venta <= fecha_fin)

    if usuario_id:
        query = query.filter(Venta.usuario_id == usuario_id)

    ventas = query.order_by(Venta.created_at.desc()).all()
    total = query.with_entities(func.coalesce(func.sum(Venta.total), 0)).scalar() or Decimal('0')
    return ventas, total
