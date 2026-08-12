from datetime import datetime
from pydantic import BaseModel, ConfigDict


class RoleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: str | None
    estado: str
    es_fijo: bool
    created_at: datetime
    updated_at: datetime
