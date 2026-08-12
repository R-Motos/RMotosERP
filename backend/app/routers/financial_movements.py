from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.models.financial_movement import MovimientoFinanciero
from app.models.product import Producto
from app.models.sale import Venta
from app.schemas.financial_movement import (
    MovimientoFinancieroCreate,
    MovimientoFinancieroListResponse,
    MovimientoFinancieroResponse,
    BalanceResponse,
)
from app.services import financial_movement_service

router = APIRouter(prefix='/movimientos-financieros', tags=['movimientos_financieros'], dependencies=[Depends(get_current_active_user)])

require_finanzas = require_permission('finanzas')


def _ventas_no_anuladas(query):
    return query.outerjoin(
        Venta,
        (MovimientoFinanciero.origen == 'venta') &
        (MovimientoFinanciero.referencia_id == Venta.id),
    ).filter(
        (MovimientoFinanciero.origen != 'venta') |
        (Venta.estado != 'anulada')
    )


@router.get('/stats', response_model=dict, dependencies=[Depends(require_permission('finanzas'))])
def get_finanzas_stats(db: Session = Depends(get_db)):
    base = _ventas_no_anuladas(db.query(MovimientoFinanciero))
    ingresos = base.with_entities(
        func.sum(MovimientoFinanciero.monto),
        func.sum(case((MovimientoFinanciero.origen == 'venta', MovimientoFinanciero.monto), else_=0)),
        func.sum(case((MovimientoFinanciero.origen == 'manual', MovimientoFinanciero.monto), else_=0)),
    ).filter(MovimientoFinanciero.tipo == 'ingreso').one()

    egresos = base.with_entities(
        func.sum(MovimientoFinanciero.monto),
        func.sum(case((MovimientoFinanciero.origen == 'compra', MovimientoFinanciero.monto), else_=0)),
        func.sum(case((MovimientoFinanciero.origen == 'manual', MovimientoFinanciero.monto), else_=0)),
    ).filter(MovimientoFinanciero.tipo == 'egreso').one()

    return {
        'total_ingresos': round(float(ingresos[0] or 0)),
        'ingresos_venta': round(float(ingresos[1] or 0)),
        'ingresos_manual': round(float(ingresos[2] or 0)),
        'total_egresos': round(float(egresos[0] or 0)),
        'egresos_compra': round(float(egresos[1] or 0)),
        'egresos_manual': round(float(egresos[2] or 0)),
        'balance': round(float((ingresos[0] or 0) - (egresos[0] or 0))),
    }


@router.get('/overview', response_model=dict, dependencies=[Depends(require_permission('finanzas'))])
def get_finanzas_overview(db: Session = Depends(get_db)):
    base = _ventas_no_anuladas(db.query(MovimientoFinanciero))
    stats = base.with_entities(
        func.sum(MovimientoFinanciero.monto),
        func.sum(case((MovimientoFinanciero.origen == 'venta', MovimientoFinanciero.monto), else_=0)),
        func.sum(case((MovimientoFinanciero.origen == 'manual', MovimientoFinanciero.monto), else_=0)),
    ).filter(MovimientoFinanciero.tipo == 'ingreso').one()

    egresos = base.with_entities(
        func.sum(MovimientoFinanciero.monto),
        func.sum(case((MovimientoFinanciero.origen == 'compra', MovimientoFinanciero.monto), else_=0)),
        func.sum(case((MovimientoFinanciero.origen == 'manual', MovimientoFinanciero.monto), else_=0)),
    ).filter(MovimientoFinanciero.tipo == 'egreso').one()

    total_ingresos = float(stats[0] or 0)
    ingresos_venta = float(stats[1] or 0)
    ingresos_manual = float(stats[2] or 0)
    total_egresos = float(egresos[0] or 0)
    egresos_compra = float(egresos[1] or 0)
    egresos_manual = float(egresos[2] or 0)

    inventario_valor = db.query(
        func.sum(Producto.precio_compra * Producto.cantidad_disponible)
    ).scalar()
    inventario_valor = float(inventario_valor or 0)

    balance = total_ingresos - total_egresos - inventario_valor

    profit_esperado = db.query(
        func.coalesce(func.sum((Producto.precio_venta - Producto.precio_compra) * Producto.cantidad_disponible), 0)
    ).filter(Producto.cantidad_disponible > 0).scalar() or 0
    profit_esperado = float(profit_esperado)

    return {
        'total_ingresos': round(total_ingresos),
        'ingresos_venta': round(ingresos_venta),
        'ingresos_manual': round(ingresos_manual),
        'total_egresos': round(total_egresos),
        'egresos_compra': round(egresos_compra),
        'egresos_manual': round(egresos_manual),
        'balance': round(balance),
        'inventario_valor': round(inventario_valor),
        'profit_esperado': round(profit_esperado),
    }


@router.post('', response_model=MovimientoFinancieroResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_permission('finanzas'))])
def create_movimiento_financiero(movimiento_in: MovimientoFinancieroCreate, db: Session = Depends(get_db)):
    try:
        return financial_movement_service.create_manual_movimiento(
            db,
            movimiento_in.tipo.value,
            movimiento_in.concepto,
            movimiento_in.descripcion,
            movimiento_in.monto,
            movimiento_in.fecha,
            movimiento_in.usuario_id,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get('', response_model=MovimientoFinancieroListResponse, dependencies=[Depends(require_permission('finanzas'))])
def list_movimientos_financieros(page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100), db: Session = Depends(get_db)):
    result = financial_movement_service.list(db, page, size)
    return MovimientoFinancieroListResponse(**result)


@router.get('/balance', response_model=BalanceResponse, dependencies=[Depends(require_permission('finanzas'))])
def get_balance(db: Session = Depends(get_db)):
    return financial_movement_service.get_balance(db)


@router.get('/{movimiento_id}', response_model=MovimientoFinancieroResponse, dependencies=[Depends(require_permission('finanzas'))])
def get_movimiento_financiero(movimiento_id: int, db: Session = Depends(get_db)):
    movimiento = financial_movement_service.get(db, movimiento_id)
    if not movimiento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Movimiento financiero no encontrado',
        )
    return movimiento
