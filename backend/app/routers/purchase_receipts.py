from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.schemas.purchase_receipt import (
    RecepcionCompraCreate,
    RecepcionCompraDetalleCreate,
    RecepcionCompraResponse,
)
from app.services import purchase_receipt_service

router = APIRouter(prefix='/recepciones-compra', tags=['recepciones_compra'], dependencies=[Depends(get_current_active_user)])

require_recepciones_compra = require_permission('recepciones_compra')


@router.post('', response_model=RecepcionCompraResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_permission('recepciones_compra'))])
def create_recepcion_compra(recepcion_in: RecepcionCompraCreate, db: Session = Depends(get_db)):
    try:
        detalles = [detalle.model_dump() for detalle in recepcion_in.detalles]
        return purchase_receipt_service.create(
            db,
            recepcion_in.orden_compra_id,
            recepcion_in.proveedor_id,
            recepcion_in.usuario_id,
            detalles,
            recepcion_in.observaciones,
            recepcion_in.estado.value,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get('', response_model=list[RecepcionCompraResponse], dependencies=[Depends(require_permission('recepciones_compra'))])
def list_recepciones_compra(estado: str | None = None, db: Session = Depends(get_db)):
    return purchase_receipt_service.list(db, estado)


@router.get('/{recepcion_id}', response_model=RecepcionCompraResponse, dependencies=[Depends(require_permission('recepciones_compra'))])
def get_recepcion_compra(recepcion_id: int, db: Session = Depends(get_db)):
    recepcion = purchase_receipt_service.get(db, recepcion_id)
    if not recepcion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Recepcion de compra no encontrada',
        )
    return recepcion
