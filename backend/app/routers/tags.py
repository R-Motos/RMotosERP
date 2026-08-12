from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.schemas.tag import EtiquetaCreate, EtiquetaResponse, EtiquetaUpdate
from app.services import tag_service

router = APIRouter(prefix='/etiquetas', tags=['etiquetas'], dependencies=[Depends(get_current_active_user)])

require_etiquetas = require_permission('etiquetas')


@router.post('', response_model=EtiquetaResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_etiquetas)])
def create_etiqueta(etiqueta_in: EtiquetaCreate, db: Session = Depends(get_db)):
    return tag_service.create(db, etiqueta_in.nombre)


@router.get('', response_model=list[EtiquetaResponse], dependencies=[Depends(require_etiquetas)])
def list_etiquetas(db: Session = Depends(get_db)):
    return tag_service.list(db)


@router.get('/{etiqueta_id}', response_model=EtiquetaResponse, dependencies=[Depends(require_etiquetas)])
def get_etiqueta(etiqueta_id: int, db: Session = Depends(get_db)):
    etiqueta = tag_service.get(db, etiqueta_id)
    if not etiqueta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Etiqueta no encontrada',
        )
    return etiqueta


@router.put('/{etiqueta_id}', response_model=EtiquetaResponse, dependencies=[Depends(require_etiquetas)])
def update_etiqueta(
    etiqueta_id: int,
    etiqueta_in: EtiquetaUpdate,
    db: Session = Depends(get_db),
):
    etiqueta = tag_service.update(db, etiqueta_id, etiqueta_in.nombre)
    if not etiqueta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Etiqueta no encontrada',
        )
    return etiqueta


@router.delete('/{etiqueta_id}', status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_etiquetas)])
def delete_etiqueta(etiqueta_id: int, db: Session = Depends(get_db)):
    if not tag_service.delete(db, etiqueta_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Etiqueta no encontrada',
        )
    return None
