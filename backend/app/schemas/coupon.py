from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict, field_validator


class CuponTipo(str, Enum):
    porcentaje = 'porcentaje'
    valor_fijo = 'valor_fijo'


class CuponEstado(str, Enum):
    activo = 'activo'
    inactivo = 'inactivo'


class CuponBase(BaseModel):
    codigo: str
    tipo: CuponTipo
    valor: int
    fecha_inicio: datetime
    fecha_fin: datetime
    uso_maximo: int
    estado: CuponEstado = CuponEstado.activo


class CuponCreate(CuponBase):
    pass


class CuponUpdate(BaseModel):
    codigo: str | None = None
    tipo: CuponTipo | None = None
    valor: int | None = None
    fecha_inicio: datetime | None = None
    fecha_fin: datetime | None = None
    uso_maximo: int | None = None
    estado: CuponEstado | None = None


class EstadoUpdate(BaseModel):
    estado: CuponEstado


class CuponResponse(CuponBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    usos_realizados: int
    created_at: datetime
    updated_at: datetime
