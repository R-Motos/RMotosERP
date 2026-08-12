from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.schemas.sale import VentaCreate, VentaDetalleCreate, VentaResponse, VentaUpdate, VentaListResponse
from app.services import sale_service

router = APIRouter(prefix='/ventas', tags=['ventas'], dependencies=[Depends(get_current_active_user)])

require_ventas = require_permission('ventas')


@router.post('', response_model=VentaResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_permission('ventas'))])
def create_venta(venta_in: VentaCreate, db: Session = Depends(get_db)):
    try:
        detalles = [detalle.model_dump() for detalle in venta_in.detalles]
        return sale_service.create(
            db,
            venta_in.usuario_id,
            venta_in.cliente_id,
            venta_in.metodo_pago.value,
            detalles,
            venta_in.estado.value,
            venta_in.descuento,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get('', response_model=VentaListResponse, dependencies=[Depends(require_permission('ventas'))])
def list_ventas(
    estado: str | None = Query(None),
    fecha_inicio: datetime | None = Query(None),
    fecha_fin: datetime | None = Query(None),
    usuario_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    items, total = sale_service.list(db, estado, fecha_inicio, fecha_fin, usuario_id)
    return VentaListResponse(items=items, total=total)


@router.get('/{venta_id}', response_model=VentaResponse, dependencies=[Depends(require_permission('ventas'))])
def get_venta(venta_id: int, db: Session = Depends(get_db)):
    venta = sale_service.get(db, venta_id)
    if not venta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Venta no encontrada',
        )
    return venta


@router.put('/{venta_id}', response_model=VentaResponse, dependencies=[Depends(require_permission('ventas'))])
def update_venta(
    venta_id: int,
    venta_in: VentaUpdate,
    db: Session = Depends(get_db),
):
    try:
        if venta_in.estado and venta_in.estado.value == 'anulada':
            return sale_service.anular(db, venta_id)
        raise ValueError('Operación no permitida')
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
