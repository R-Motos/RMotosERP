from pydantic import BaseModel, ConfigDict

from app.models.role import Role


class RoleSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: str | None
    estado: str
    es_fijo: bool


class LoginRequest(BaseModel):
    username: str | None = None
    pin: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int


class MeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    username: str
    email: str | None
    telefono: str | None
    roles: list[RoleSimple]
    modules: list[str]
