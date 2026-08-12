from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_active_user, require_permission
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services import user_service

router = APIRouter(prefix='/usuarios', tags=['usuarios'], dependencies=[Depends(get_current_active_user)])

require_usuarios = require_permission('usuarios')


@router.post('', response_model=UserResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_usuarios)])
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    return user_service.create(db, user_in.nombre, user_in.username, user_in.email, user_in.telefono, user_in.pin, user_in.rol_ids, user_in.estado.value)


@router.get('', response_model=list[UserResponse], dependencies=[Depends(require_usuarios)])
def list_users(estado: str | None = Query(None), q: str | None = Query(None), db: Session = Depends(get_db)):
    return user_service.list(db, estado, q)


@router.get('/{user_id}', response_model=UserResponse, dependencies=[Depends(require_usuarios)])
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = user_service.get(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Usuario no encontrado',
        )
    return user


@router.put('/{user_id}', response_model=UserResponse, dependencies=[Depends(require_usuarios)])
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
):
    user = user_service.update(db, user_id, user_in.nombre, user_in.username, user_in.email, user_in.telefono, user_in.pin, user_in.rol_ids, user_in.modules, user_in.estado.value if user_in.estado else None)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Usuario no encontrado',
        )
    return user
