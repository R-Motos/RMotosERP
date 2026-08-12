from typing import Annotated

from fastapi import Depends, HTTPException, Header, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.services import auth_service, permission_service


def get_current_user(
    authorization: Annotated[str, Header()],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Formato de autorización inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.replace("Bearer ", "")
    usuario = auth_service.get_current_user_from_token(db, token)
    return usuario


def get_current_active_user(
    usuario: Annotated[User, Depends(get_current_user)],
) -> User:
    if usuario.estado != 'activo':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo",
        )
    return usuario


def require_permission(modulo: str):
    async def checker(
        usuario: Annotated[User, Depends(get_current_active_user)],
        db: Annotated[Session, Depends(get_db)],
    ) -> User:
        modulos = auth_service.get_user_modules(db, usuario.id)
        if modulo not in modulos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permiso para acceder a este módulo",
            )
        return usuario

    return checker
