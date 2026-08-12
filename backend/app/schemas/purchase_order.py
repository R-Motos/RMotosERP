from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict


class OrdenCompraEstado(str, Enum):
    borrador = 'borrador'
    enviada = 'enviada'
    parcialmente_recibida = 'parcialmente_recibida'
    completada = 'completada'
    cancelada = 'cancelada'


class OrdenCompraDetalleCreate(BaseModel):
    producto_id: int
    cantidad: int
    precio_unitario: int


class OrdenCompraDetalleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    orden_id: int
    producto_id: int
    cantidad: int
    precio_unitario: int
    subtotal: int


class OrdenCompraCreate(BaseModel):
    proveedor_id: int
    usuario_id: int
    observaciones: str | None = None
    estado: OrdenCompraEstado = OrdenCompraEstado.borrador
    detalles: list[OrdenCompraDetalleCreate]


class OrdenCompraUpdate(BaseModel):
    observaciones: str | None = None
    estado: OrdenCompraEstado | None = None


class OrdenCompraResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    numero: str
    proveedor_id: int
    proveedor_nombre: str | None = None
    usuario_id: int
    estado: OrdenCompraEstado
    observaciones: str | None
    total: int
    created_at: datetime
    updated_at: datetime
    detalles: list[OrdenCompraDetalleResponse] = []
