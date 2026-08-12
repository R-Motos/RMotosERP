from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict


class ProveedorEstado(str, Enum):
    activo = 'activo'
    inactivo = 'inactivo'


class ProveedorCreate(BaseModel):
    nombre: str
    nit: str | None = None
    contacto: str | None = None
    telefono: str | None = None
    email: str | None = None
    direccion: str | None = None
    ciudad: str | None = None
    observaciones: str | None = None
    estado: ProveedorEstado = ProveedorEstado.activo


class ProveedorUpdate(BaseModel):
    nombre: str | None = None
    nit: str | None = None
    contacto: str | None = None
    telefono: str | None = None
    email: str | None = None
    direccion: str | None = None
    ciudad: str | None = None
    observaciones: str | None = None
    estado: ProveedorEstado | None = None


class ProveedorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    nit: str | None
    contacto: str | None
    telefono: str | None
    email: str | None
    direccion: str | None
    ciudad: str | None
    observaciones: str | None
    estado: ProveedorEstado
    created_at: datetime
    updated_at: datetime
