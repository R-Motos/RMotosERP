from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict

from app.models.role import Role


class RoleSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: str | None
    estado: str
    es_fijo: bool


class UserEstado(str, Enum):
    activo = 'activo'
    inactivo = 'inactivo'


class UserCreate(BaseModel):
    nombre: str
    username: str
    email: str | None = None
    telefono: str | None = None
    pin: str | None = None
    rol_ids: list[int] | None = None
    estado: UserEstado = UserEstado.activo


class UserUpdate(BaseModel):
    nombre: str | None = None
    username: str | None = None
    email: str | None = None
    telefono: str | None = None
    pin: str | None = None
    rol_ids: list[int] | None = None
    modules: list[str] | None = None
    estado: UserEstado | None = None


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    username: str
    email: str | None
    telefono: str | None
    roles: list[RoleSimple]
    estado: UserEstado
    modules: list[str]
    created_at: datetime
    updated_at: datetime
