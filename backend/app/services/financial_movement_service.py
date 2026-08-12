from decimal import Decimal
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.financial_movement import MovimientoFinanciero
from app.models.sale import Venta
from app.models.user import User


TIPOS_PERMITIDOS = {'ingreso', 'egreso'}
ORIGENES_PERMITIDOS = {'venta', 'compra', 'manual'}


def _exclude_canceled_sales(query):
    return query.outerjoin(
        Venta,
        (MovimientoFinanciero.origen == 'venta') &
        (MovimientoFinanciero.referencia_id == Venta.id),
    ).filter(
        (MovimientoFinanciero.origen != 'venta') |
        (Venta.estado != 'anulada')
    )


def create_movimiento(db: Session, tipo: str, concepto: str, descripcion: str | None, monto: Decimal, fecha: datetime, origen: str, referencia_id: int | None, usuario_id: int) -> MovimientoFinanciero:
    if tipo not in TIPOS_PERMITIDOS:
        raise ValueError('Tipo de movimiento no permitido')
    if origen not in ORIGENES_PERMITIDOS:
        raise ValueError('Origen de movimiento no permitido')
    if monto <= 0:
        raise ValueError('El monto debe ser mayor a 0')

    usuario = db.get(User, usuario_id)
    if not usuario:
        raise ValueError('Usuario no encontrado')

    movimiento = MovimientoFinanciero(
        tipo=tipo,
        concepto=concepto,
        descripcion=descripcion,
        monto=monto,
        fecha=fecha,
        origen=origen,
        referencia_id=referencia_id,
        usuario_id=usuario_id,
    )
    db.add(movimiento)
    db.commit()
    db.refresh(movimiento)
    return movimiento


def create_manual_movimiento(db: Session, tipo: str, concepto: str, descripcion: str | None, monto: Decimal, fecha: datetime, usuario_id: int) -> MovimientoFinanciero:
    return create_movimiento(
        db,
        tipo=tipo,
        concepto=concepto,
        descripcion=descripcion,
        monto=monto,
        fecha=fecha,
        origen='manual',
        referencia_id=None,
        usuario_id=usuario_id,
    )


def get(db: Session, movimiento_id: int) -> MovimientoFinanciero | None:
    return db.get(MovimientoFinanciero, movimiento_id)


def list(db: Session, page: int = 1, size: int = 20) -> dict:
    query = db.query(MovimientoFinanciero)
    total = query.count()
    items = query.order_by(MovimientoFinanciero.created_at.desc()).offset((page - 1) * size).limit(size).all()
    return {
        'items': items,
        'total': total,
        'page': page,
        'size': size,
    }


def get_balance(db: Session) -> dict:
    base_query = _exclude_canceled_sales(db.query(MovimientoFinanciero))
    total_ingresos = base_query.with_entities(func.coalesce(func.sum(MovimientoFinanciero.monto), Decimal('0'))).filter(MovimientoFinanciero.tipo == 'ingreso').scalar()
    total_egresos = base_query.with_entities(func.coalesce(func.sum(MovimientoFinanciero.monto), Decimal('0'))).filter(MovimientoFinanciero.tipo == 'egreso').scalar()
    return {
        'total_ingresos': total_ingresos or Decimal('0'),
        'total_egresos': total_egresos or Decimal('0'),
        'balance': (total_ingresos or Decimal('0')) - (total_egresos or Decimal('0')),
    }
