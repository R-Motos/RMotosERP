from datetime import datetime
from pydantic import BaseModel, ConfigDict


class SystemConfigResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre_negocio: str
    nit: str
    telefono: str
    email: str
    direccion: str
    ciudad: str
    logo: str | None
    moneda: str
    simbolo_moneda: str
    created_at: datetime
    updated_at: datetime


class SystemConfigUpdate(BaseModel):
    nombre_negocio: str | None = None
    nit: str | None = None
    telefono: str | None = None
    email: str | None = None
    direccion: str | None = None
    ciudad: str | None = None
    logo: str | None = None
    moneda: str | None = None
    simbolo_moneda: str | None = None
