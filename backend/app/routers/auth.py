from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.db.session import get_db
from app.dependencies.auth import get_current_active_user
from app.models.role import Role
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse, MeResponse
from app.services import auth_service, rbac_service, user_service

router = APIRouter(prefix='/auth', tags=['auth'])


@router.post('/login', response_model=LoginResponse)
def login(login_in: LoginRequest, db: Session = Depends(get_db)):
    usuario = auth_service.authenticate_user(db, login_in.username, login_in.pin)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
        )

    access_token = auth_service.create_access_token(usuario.id)
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_HOURS * 3600,
    )


@router.post('/setup', status_code=status.HTTP_201_CREATED)
def initial_setup(db: Session = Depends(get_db)):
    admin_role = db.query(Role).filter(Role.nombre == 'administrador').first()
    if not admin_role:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No existe el rol administrador",
        )

    usuario = user_service.get_by_username(db, 'admin')
    if usuario:
        usuario.nombre = 'Administrador'
        usuario.username = 'admin'
        usuario.pin = None
        usuario.pin_hash = auth_service.hash_pin('1234')
        usuario.estado = 'activo'
        db.commit()
        db.refresh(usuario)
        message = 'Usuario administrador actualizado'
    else:
        usuario = user_service.create(db, nombre='Administrador', username='admin', pin='1234', rol_ids=[admin_role.id])
        message = 'Usuario administrador creado'

    rbac_service.initialize_rbac(db)
    return {'message': message, 'usuario_id': usuario.id}


@router.get('/me', response_model=MeResponse)
def get_me(usuario=Depends(get_current_active_user)):
    return usuario


@router.post('/logout', status_code=status.HTTP_204_NO_CONTENT)
def logout():
    return None
