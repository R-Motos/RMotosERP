import bcrypt
from datetime import datetime, timedelta
from typing import Optional

from fastapi import HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session, selectinload

from app.config import settings
from app.models.user import User, usuario_roles
from app.services import user_service
from app.services.permission_service import get_user_permissions


def hash_pin(pin: str) -> str:
    return bcrypt.hashpw(pin.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_pin(plain_pin: str, hashed_pin: str) -> bool:
    return bcrypt.checkpw(plain_pin.encode('utf-8'), hashed_pin.encode('utf-8'))


def authenticate_user(db: Session, username: str | None, pin: str) -> Optional[User]:
    usuario = None
    if username:
        usuario = user_service.get_by_username(db, username)
        if usuario:
            if usuario.pin_hash is None:
                if usuario.pin == pin:
                    usuario.pin_hash = hash_pin(pin)
                    usuario.pin = None
                    db.commit()
                    db.refresh(usuario)
                else:
                    usuario = None
            elif not verify_pin(pin, usuario.pin_hash):
                usuario = None
    else:
        usuario = user_service.get_by_pin(db, pin)

    if not usuario:
        return None

    if usuario.estado != 'activo':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo",
        )

    return usuario


def create_access_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(hours=settings.ACCESS_TOKEN_EXPIRE_HOURS)
    payload = {
        "sub": str(user_id),
        "exp": expire,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


def get_current_user_from_token(db: Session, token: str) -> Optional[User]:
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )

    usuario = user_service.get(db, int(user_id))
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return usuario


def get_user_modules(db: Session, user_id: int) -> list[str]:
    from app.services import permission_service
    return permission_service.get_user_modules(db, user_id)
