from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CategoriaCreate(BaseModel):
    nombre: str


class CategoriaUpdate(BaseModel):
    nombre: str


class CategoriaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    created_at: datetime
    updated_at: datetime
