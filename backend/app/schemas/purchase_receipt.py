from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict


class RecepcionCompraEstado(str, Enum):
    pendiente = 'pendiente'
    completada = 'completada'
    cancelada = 'cancelada'


class RecepcionCompraDetalleCreate(BaseModel):
    producto_id: int
    cantidad_recibida: int
    precio_unitario: int


class RecepcionCompraDetalleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recepcion_id: int
    producto_id: int
    cantidad_recibida: int
    precio_unitario: int


class RecepcionCompraCreate(BaseModel):
    orden_compra_id: int
    proveedor_id: int
    usuario_id: int
    observaciones: str | None = None
    estado: RecepcionCompraEstado = RecepcionCompraEstado.pendiente
    detalles: list[RecepcionCompraDetalleCreate]


class RecepcionCompraResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    orden_compra_id: int
    proveedor_id: int
    usuario_id: int
    fecha: datetime
    observaciones: str | None
    estado: RecepcionCompraEstado
    created_at: datetime
    updated_at: datetime
    detalles: list[RecepcionCompraDetalleResponse] = []
