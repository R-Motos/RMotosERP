from datetime import datetime
from pydantic import BaseModel, ConfigDict


class MarcaCreate(BaseModel):
    nombre: str


class MarcaUpdate(BaseModel):
    nombre: str


class MarcaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    created_at: datetime
    updated_at: datetime
