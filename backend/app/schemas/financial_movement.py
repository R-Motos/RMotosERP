from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict


class MovimientoFinancieroTipo(str, Enum):
    ingreso = 'ingreso'
    egreso = 'egreso'


class MovimientoFinancieroOrigen(str, Enum):
    venta = 'venta'
    compra = 'compra'
    manual = 'manual'


class MovimientoFinancieroCreate(BaseModel):
    tipo: MovimientoFinancieroTipo
    concepto: str
    descripcion: str | None = None
    monto: int
    fecha: datetime
    origen: MovimientoFinancieroOrigen = MovimientoFinancieroOrigen.manual
    referencia_id: int | None = None
    usuario_id: int


class MovimientoFinancieroResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tipo: MovimientoFinancieroTipo
    concepto: str
    descripcion: str | None
    monto: int
    fecha: datetime
    origen: MovimientoFinancieroOrigen
    referencia_id: int | None
    usuario_id: int
    created_at: datetime
    updated_at: datetime


class MovimientoFinancieroListResponse(BaseModel):
    items: list[MovimientoFinancieroResponse]
    total: int
    page: int
    size: int


class BalanceResponse(BaseModel):
    total_ingresos: int
    total_egresos: int
    balance: int
