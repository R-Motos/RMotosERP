from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict


class ClienteEstado(str, Enum):
    activo = 'activo'
    inactivo = 'inactivo'


class ClienteCreate(BaseModel):
    nombre: str
    email: str | None = None
    telefono: str | None = None
    estado: ClienteEstado = ClienteEstado.activo


class ClienteUpdate(BaseModel):
    nombre: str | None = None
    email: str | None = None
    telefono: str | None = None
    estado: ClienteEstado | None = None


class ClienteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    email: str | None
    telefono: str | None
    cantidad_compras: int
    total_gastado: int
    estado: ClienteEstado
    created_at: datetime
    updated_at: datetime
