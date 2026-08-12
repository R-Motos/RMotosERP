from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.schemas.supplier import ProveedorCreate, ProveedorResponse, ProveedorUpdate
from app.services import supplier_service

router = APIRouter(prefix='/proveedores', tags=['proveedores'], dependencies=[Depends(get_current_active_user)])

require_proveedores = require_permission('proveedores')


@router.post('', response_model=ProveedorResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_permission('proveedores'))])
def create_proveedor(proveedor_in: ProveedorCreate, db: Session = Depends(get_db)):
    return supplier_service.create(
        db,
        proveedor_in.nombre,
        proveedor_in.nit,
        proveedor_in.contacto,
        proveedor_in.telefono,
        proveedor_in.email,
        proveedor_in.direccion,
        proveedor_in.ciudad,
        proveedor_in.observaciones,
        proveedor_in.estado.value,
    )


@router.get('', response_model=list[ProveedorResponse], dependencies=[Depends(require_permission('proveedores'))])
def list_proveedores(estado: str | None = Query(None), q: str | None = Query(None), db: Session = Depends(get_db)):
    return supplier_service.list(db, estado, q)


@router.get('/{proveedor_id}', response_model=ProveedorResponse, dependencies=[Depends(require_permission('proveedores'))])
def get_proveedor(proveedor_id: int, db: Session = Depends(get_db)):
    proveedor = supplier_service.get(db, proveedor_id)
    if not proveedor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Proveedor no encontrado',
        )
    return proveedor


@router.put('/{proveedor_id}', response_model=ProveedorResponse, dependencies=[Depends(require_permission('proveedores'))])
def update_proveedor(
    proveedor_id: int,
    proveedor_in: ProveedorUpdate,
    db: Session = Depends(get_db),
):
    proveedor = supplier_service.update(
        db,
        proveedor_id,
        proveedor_in.nombre,
        proveedor_in.nit,
        proveedor_in.contacto,
        proveedor_in.telefono,
        proveedor_in.email,
        proveedor_in.direccion,
        proveedor_in.ciudad,
        proveedor_in.observaciones,
        proveedor_in.estado.value if proveedor_in.estado else None,
    )
    if not proveedor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Proveedor no encontrado',
        )
    return proveedor
