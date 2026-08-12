from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from decimal import Decimal

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.schemas.inventory_movement import MovimientoCreate, MovimientoResponse
from app.services import inventory_movement_service

router = APIRouter(prefix='/movimientos', tags=['movimientos'], dependencies=[Depends(get_current_active_user)])

require_movimientos = require_permission('movimientos')


@router.post('', response_model=MovimientoResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_permission('movimientos'))])
def create_movimiento(movimiento_in: MovimientoCreate, db: Session = Depends(get_db)):
    try:
        return inventory_movement_service.create(
            db,
            movimiento_in.producto_id,
            movimiento_in.tipo.value,
            movimiento_in.cantidad,
            movimiento_in.usuario_id,
            movimiento_in.observaciones,
            movimiento_in.referencia,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get('', response_model=list[MovimientoResponse], dependencies=[Depends(require_permission('movimientos'))])
def list_movimientos(db: Session = Depends(get_db)):
    return inventory_movement_service.list(db)


@router.get('/{movimiento_id}', response_model=MovimientoResponse, dependencies=[Depends(require_permission('movimientos'))])
def get_movimiento(movimiento_id: int, db: Session = Depends(get_db)):
    movimiento = inventory_movement_service.get(db, movimiento_id)
    if not movimiento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Movimiento no encontrado',
        )
    return movimiento
