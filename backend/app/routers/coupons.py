from fastapi import APIRouter, Depends, Query, Body, Response, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.session import get_db
from app.dependencies.auth import require_permission
from app.models.coupon import Cupon
from app.schemas.coupon import CuponCreate, CuponUpdate, CuponResponse, EstadoUpdate
from app.services import coupon_service

router = APIRouter(prefix='/cupones', tags=['cupones'])


@router.get('', response_model=list[CuponResponse], dependencies=[Depends(require_permission('cupones'))])
def list_cupones(estado: str | None = Query(None), q: str | None = Query(None), db: Session = Depends(get_db)):
    return coupon_service.list(db, estado, q)


@router.post('', response_model=CuponResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_permission('cupones'))])
def create_cupon(data: CuponCreate, db: Session = Depends(get_db)):
    try:
        cupon = coupon_service.create(
            db,
            codigo=data.codigo,
            tipo=data.tipo.value,
            valor=data.valor,
            fecha_inicio=data.fecha_inicio,
            fecha_fin=data.fecha_fin,
            uso_maximo=data.uso_maximo,
            estado=data.estado.value,
        )
        return cupon
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get('/{cupon_id}', response_model=CuponResponse, dependencies=[Depends(require_permission('cupones'))])
def get_cupon(cupon_id: int, db: Session = Depends(get_db)):
    cupon = coupon_service.get(db, cupon_id)
    if not cupon:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail='Cupón no encontrado')
    return cupon


@router.put('/{cupon_id}', response_model=CuponResponse, dependencies=[Depends(require_permission('cupones'))])
def update_cupon(cupon_id: int, data: CuponUpdate, db: Session = Depends(get_db)):
    update_data = data.model_dump(exclude_unset=True)
    if 'tipo' in update_data:
        update_data['tipo'] = update_data['tipo'].value
    if 'estado' in update_data:
        update_data['estado'] = update_data['estado'].value
    cupon = coupon_service.update(db, cupon_id, **update_data)
    if not cupon:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail='Cupón no encontrado')
    return cupon


@router.patch('/{cupon_id}/estado', response_model=CuponResponse, dependencies=[Depends(require_permission('cupones'))])
def change_cupon_state(cupon_id: int, data: EstadoUpdate, db: Session = Depends(get_db)):
    cupon = coupon_service.change_state(db, cupon_id, data.estado)
    if not cupon:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail='Cupón no encontrado')
    return cupon


@router.delete('/{cupon_id}', status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_permission('cupones'))])
def delete_cupon(cupon_id: int, db: Session = Depends(get_db)):
    cupon = coupon_service.delete(db, cupon_id)
    if not cupon:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail='Cupón no encontrado')
    return Response(status_code=status.HTTP_204_NO_CONTENT)
