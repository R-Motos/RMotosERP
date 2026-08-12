from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict


class VentaEstado(str, Enum):
    pendiente = 'pendiente'
    completada = 'completada'
    anulada = 'anulada'


class MetodoPago(str, Enum):
    efectivo = 'efectivo'
    transferencia = 'transferencia'
    tarjeta = 'tarjeta'
    otro = 'otro'


class VentaDetalleCreate(BaseModel):
    producto_id: int
    cantidad: int
    precio_unitario: int
    descuento: int = 0


class VentaDetalleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    venta_id: int
    producto_id: int
    cantidad: int
    precio_unitario: int
    descuento: int
    subtotal: int
    created_at: datetime
    updated_at: datetime


class VentaCreate(BaseModel):
    usuario_id: int
    cliente_id: int | None = None
    metodo_pago: MetodoPago
    estado: VentaEstado = VentaEstado.completada
    descuento: int = 0
    detalles: list[VentaDetalleCreate]


class VentaUpdate(BaseModel):
    estado: VentaEstado | None = None


class VentaListResponse(BaseModel):
    items: list[VentaResponse]
    total: int


class VentaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    numero: str
    usuario_id: int
    cliente_id: int | None
    cliente_nombre: str | None = None
    fecha_venta: datetime
    subtotal: int
    descuento: int
    total: int
    metodo_pago: MetodoPago
    estado: VentaEstado
    created_at: datetime
    updated_at: datetime
    detalles: list[VentaDetalleResponse] = []
