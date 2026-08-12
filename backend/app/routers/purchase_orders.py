from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.schemas.purchase_order import (
    OrdenCompraCreate,
    OrdenCompraDetalleCreate,
    OrdenCompraResponse,
    OrdenCompraUpdate,
)
from app.services import purchase_order_service

router = APIRouter(prefix='/ordenes-compra', tags=['ordenes_compra'], dependencies=[Depends(get_current_active_user)])

require_ordenes_compra = require_permission('ordenes_compra')


@router.post('', response_model=OrdenCompraResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_permission('ordenes_compra'))])
def create_orden_compra(orden_in: OrdenCompraCreate, db: Session = Depends(get_db)):
    try:
        detalles = [detalle.model_dump() for detalle in orden_in.detalles]
        return purchase_order_service.create(
            db,
            orden_in.proveedor_id,
            orden_in.usuario_id,
            detalles,
            orden_in.observaciones,
            orden_in.estado.value,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get('', response_model=list[OrdenCompraResponse], dependencies=[Depends(require_permission('ordenes_compra'))])
def list_ordenes_compra(estado: str | None = None, db: Session = Depends(get_db)):
    return purchase_order_service.list(db, estado)


@router.get('/{orden_id}', response_model=OrdenCompraResponse, dependencies=[Depends(require_permission('ordenes_compra'))])
def get_orden_compra(orden_id: int, db: Session = Depends(get_db)):
    orden = purchase_order_service.get(db, orden_id)
    if not orden:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Orden de compra no encontrada',
        )
    return orden


@router.put('/{orden_id}', response_model=OrdenCompraResponse, dependencies=[Depends(require_permission('ordenes_compra'))])
def update_orden_compra(
    orden_id: int,
    orden_in: OrdenCompraUpdate,
    db: Session = Depends(get_db),
):
    try:
        orden = purchase_order_service.update(
            db,
            orden_id,
            orden_in.observaciones,
            orden_in.estado.value if orden_in.estado else None,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    if not orden:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Orden de compra no encontrada',
        )
    return orden
