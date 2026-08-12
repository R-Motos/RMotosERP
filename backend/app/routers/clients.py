from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.schemas.client import ClienteCreate, ClienteResponse, ClienteUpdate
from app.services import client_service

router = APIRouter(prefix='/clientes', tags=['clientes'])

require_clientes = require_permission('clientes')


@router.get('', response_model=list[ClienteResponse], dependencies=[Depends(require_permission('clientes'))])
def list_clientes(estado: str | None = Query(None), q: str | None = Query(None), db: Session = Depends(get_db)):
    return client_service.list(db, estado, q)


@router.post('', response_model=ClienteResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_permission('clientes'))])
def create_cliente(cliente_in: ClienteCreate, db: Session = Depends(get_db)):
    return client_service.create(db, cliente_in.nombre, cliente_in.email, cliente_in.telefono, cliente_in.estado.value)


@router.get('/{cliente_id}', response_model=ClienteResponse, dependencies=[Depends(require_permission('clientes'))])
def get_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = client_service.get(db, cliente_id)
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Cliente no encontrado',
        )
    return cliente


@router.put('/{cliente_id}', response_model=ClienteResponse, dependencies=[Depends(require_permission('clientes'))])
def update_cliente(
    cliente_id: int,
    cliente_in: ClienteUpdate,
    db: Session = Depends(get_db),
):
    cliente = client_service.update(db, cliente_id, cliente_in.nombre, cliente_in.email, cliente_in.telefono, cliente_in.estado.value if cliente_in.estado else None)
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Cliente no encontrado',
        )
    return cliente
