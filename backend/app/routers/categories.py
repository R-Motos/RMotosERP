from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.schemas.category import CategoriaCreate, CategoriaResponse, CategoriaUpdate
from app.services import category_service

router = APIRouter(prefix='/categorias', tags=['categorias'], dependencies=[Depends(get_current_active_user)])

require_categorias = require_permission("categorias")


@router.post('', response_model=CategoriaResponse, status_code=status.HTTP_201_CREATED)
def create_categoria(
    categoria_in: CategoriaCreate,
    db: Session = Depends(get_db),
    _: None = Depends(require_categorias),
):
    return category_service.create(db, categoria_in.nombre)


@router.get('', response_model=list[CategoriaResponse])
def list_categorias(
    db: Session = Depends(get_db),
    _: None = Depends(require_categorias),
):
    return category_service.list(db)


@router.get('/{categoria_id}', response_model=CategoriaResponse)
def get_categoria(
    categoria_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(require_categorias),
):
    categoria = category_service.get(db, categoria_id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Categoria no encontrada',
        )
    return categoria


@router.put('/{categoria_id}', response_model=CategoriaResponse)
def update_categoria(
    categoria_id: int,
    categoria_in: CategoriaUpdate,
    db: Session = Depends(get_db),
    _: None = Depends(require_categorias),
):
    categoria = category_service.update(db, categoria_id, categoria_in.nombre)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Categoria no encontrada',
        )
    return categoria


@router.delete('/{categoria_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_categoria(
    categoria_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(require_categorias),
):
    if not category_service.delete(db, categoria_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Categoria no encontrada',
        )
    return None
