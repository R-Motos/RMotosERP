from decimal import Decimal
from sqlalchemy import select, text
from sqlalchemy.orm import Session, selectinload

from app.models.purchase_order import OrdenCompra, OrdenCompraDetalle
from app.models.product import Producto
from app.models.supplier import Proveedor
from app.models.user import User
from app.services import audit_service, financial_movement_service


ESTADOS_INMODIFICABLES = {'completada', 'cancelada'}


def _ensure_detalle_columns(db: Session) -> None:
    result = db.execute(text("PRAGMA table_info(ordenes_compra_detalle)"))
    columns = {row[1] for row in result.fetchall()}
    if 'created_at' not in columns:
        db.execute(text('ALTER TABLE ordenes_compra_detalle ADD COLUMN created_at DATETIME'))
    if 'updated_at' not in columns:
        db.execute(text('ALTER TABLE ordenes_compra_detalle ADD COLUMN updated_at DATETIME'))
    if columns:
        db.commit()


def _generar_numero(db: Session) -> str:
    ultima = db.query(OrdenCompra).order_by(OrdenCompra.id.desc()).first()
    if ultima:
        try:
            ultimo_numero = int(ultima.numero.split('-')[-1])
        except (ValueError, IndexError):
            ultimo_numero = 0
    else:
        ultimo_numero = 0
    return f'OC-{ultimo_numero + 1:05d}'


def create(db: Session, proveedor_id: int, usuario_id: int, detalles_data: list[dict], observaciones: str | None = None, estado: str = 'borrador') -> OrdenCompra:
    _ensure_detalle_columns(db)
    proveedor = db.get(Proveedor, proveedor_id)
    if not proveedor:
        raise ValueError('Proveedor no encontrado')

    usuario = db.get(User, usuario_id)
    if not usuario:
        raise ValueError('Usuario no encontrado')

    if not detalles_data:
        raise ValueError('La orden debe tener al menos un producto')

    productos_vistos = set()
    total = Decimal('0')
    detalles = []

    for detalle_data in detalles_data:
        producto_id = detalle_data['producto_id']
        if producto_id in productos_vistos:
            raise ValueError('Producto repetido en la orden')
        productos_vistos.add(producto_id)

        producto = db.get(Producto, producto_id)
        if not producto:
            raise ValueError('Producto no encontrado')

        cantidad = detalle_data['cantidad']
        precio_unitario = detalle_data['precio_unitario']
        subtotal = cantidad * precio_unitario
        total += subtotal

        detalles.append(OrdenCompraDetalle(
            producto_id=producto_id,
            cantidad=cantidad,
            precio_unitario=precio_unitario,
            subtotal=subtotal,
        ))

    numero = _generar_numero(db)
    orden = OrdenCompra(
        numero=numero,
        proveedor_id=proveedor_id,
        usuario_id=usuario_id,
        estado=estado,
        observaciones=observaciones,
        total=total,
    )
    db.add(orden)
    db.flush()

    for detalle in detalles:
        detalle.orden_id = orden.id
        db.add(detalle)

    db.commit()
    db.refresh(orden)

    audit_service.log(
        db,
        usuario_id=usuario_id,
        modulo='ordenes_compra',
        accion='crear',
        registro_id=orden.id,
        descripcion=f'Orden de compra {orden.numero} creada',
        datos_nuevos={'id': orden.id, 'numero': orden.numero, 'estado': orden.estado},
    )

    return orden


def get(db: Session, orden_id: int) -> OrdenCompra | None:
    return db.query(OrdenCompra).filter(OrdenCompra.id == orden_id).first()


def list(db: Session, estado: str | None = None) -> list[OrdenCompra]:
    query = db.query(OrdenCompra).options(selectinload(OrdenCompra.proveedor))
    if estado:
        query = query.filter(OrdenCompra.estado == estado)
    return query.order_by(OrdenCompra.created_at.desc()).all()


def update(db: Session, orden_id: int, observaciones: str | None = None, estado: str | None = None) -> OrdenCompra | None:
    orden = get(db, orden_id)
    if not orden:
        raise ValueError('Orden de compra no encontrada')

    if orden.estado in ESTADOS_INMODIFICABLES:
        raise ValueError('No se puede modificar una orden en estado completada o cancelada')

    datos_anteriores = {
        'observaciones': orden.observaciones,
        'estado': orden.estado,
    }

    if observaciones is not None:
        orden.observaciones = observaciones
    if estado is not None:
        orden.estado = estado

    db.commit()
    db.refresh(orden)

    if estado == 'completada':
        financial_movement_service.create_movimiento(
            db,
            tipo='egreso',
            concepto=f'Orden de compra {orden.numero}',
            descripcion=orden.observaciones,
            monto=orden.total,
            fecha=orden.created_at,
            origen='compra',
            referencia_id=orden.id,
            usuario_id=orden.usuario_id,
        )

    accion = 'aprobar' if estado in ('completada', 'enviada') else 'editar'
    audit_service.log(
        db,
        usuario_id=orden.usuario_id,
        modulo='ordenes_compra',
        accion=accion,
        registro_id=orden.id,
        descripcion=f'Orden de compra {orden.numero} actualizada',
        datos_anteriores=datos_anteriores,
        datos_nuevos={'id': orden.id, 'numero': orden.numero, 'estado': orden.estado},
    )

    return orden
