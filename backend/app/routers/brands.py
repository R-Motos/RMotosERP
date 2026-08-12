from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.schemas.brand import MarcaCreate, MarcaResponse, MarcaUpdate
from app.services import brand_service

router = APIRouter(prefix='/marcas', tags=['marcas'], dependencies=[Depends(get_current_active_user)])

require_marcas = require_permission("marcas")


@router.post('', response_model=MarcaResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_marcas)])
def create_marca(marca_in: MarcaCreate, db: Session = Depends(get_db)):
    return brand_service.create(db, marca_in.nombre)


@router.get('', response_model=list[MarcaResponse], dependencies=[Depends(require_marcas)])
def list_marcas(db: Session = Depends(get_db)):
    return brand_service.list(db)


@router.get('/{marca_id}', response_model=MarcaResponse, dependencies=[Depends(require_marcas)])
def get_marca(marca_id: int, db: Session = Depends(get_db)):
    marca = brand_service.get(db, marca_id)
    if not marca:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Marca no encontrada',
        )
    return marca


@router.put('/{marca_id}', response_model=MarcaResponse, dependencies=[Depends(require_marcas)])
def update_marca(
    marca_id: int,
    marca_in: MarcaUpdate,
    db: Session = Depends(get_db),
):
    marca = brand_service.update(db, marca_id, marca_in.nombre)
    if not marca:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Marca no encontrada',
        )
    return marca


@router.delete('/{marca_id}', status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_marcas)])
def delete_marca(marca_id: int, db: Session = Depends(get_db)):
    if not brand_service.delete(db, marca_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Marca no encontrada',
        )
    return None
