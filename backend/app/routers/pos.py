from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.schemas.category import CategoriaResponse
from app.schemas.brand import MarcaResponse
from app.schemas.tag import EtiquetaResponse
from app.services import category_service, brand_service, tag_service

router = APIRouter(prefix='/pos', tags=['pos'], dependencies=[Depends(get_current_active_user)])

require_pos = require_permission('pos')


@router.get('/categorias', response_model=list[CategoriaResponse])
def list_pos_categorias(
    db: Session = Depends(get_db),
    _: None = Depends(require_pos),
):
    return category_service.list(db)


@router.get('/marcas', response_model=list[MarcaResponse])
def list_pos_marcas(
    db: Session = Depends(get_db),
    _: None = Depends(require_pos),
):
    return brand_service.list(db)


@router.get('/etiquetas', response_model=list[EtiquetaResponse])
def list_pos_etiquetas(
    db: Session = Depends(get_db),
    _: None = Depends(require_pos),
):
    return tag_service.list(db)
