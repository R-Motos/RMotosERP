from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict


class MovimientoTipo(str, Enum):
    entrada = 'entrada'
    salida = 'salida'
    ajuste = 'ajuste'


class MovimientoCreate(BaseModel):
    producto_id: int
    tipo: MovimientoTipo
    cantidad: int
    observaciones: str | None = None
    usuario_id: int
    referencia: str | None = None


class MovimientoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    producto_id: int
    tipo: MovimientoTipo
    cantidad: int
    observaciones: str | None
    usuario_id: int
    referencia: str | None
    created_at: datetime
    updated_at: datetime
