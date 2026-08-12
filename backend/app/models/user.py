from datetime import datetime
from sqlalchemy import CheckConstraint, Column, DateTime, ForeignKey, Integer, String, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.orm import DeclarativeBase

from app.db.base import Base


usuario_roles = Table(
    'usuario_roles',
    Base.metadata,
    Column('usuario_id', Integer, ForeignKey('usuarios.id'), primary_key=True),
    Column('rol_id', Integer, ForeignKey('roles.id'), primary_key=True),
)


class OverrideBase(DeclarativeBase):
    metadata = Base.metadata


class UsuarioPermisoOverride(OverrideBase):
    __tablename__ = 'usuario_permisos_override'

    usuario_id: Mapped[int] = mapped_column(ForeignKey('usuarios.id'), primary_key=True)
    permiso_id: Mapped[int] = mapped_column(ForeignKey('permisos.id'), primary_key=True)
    permitido: Mapped[bool] = mapped_column(nullable=False)


class User(Base):
    __tablename__ = 'usuarios'

    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=True)
    telefono: Mapped[str] = mapped_column(String(50), nullable=True)
    pin: Mapped[str] = mapped_column(String(4), nullable=True)
    pin_hash: Mapped[str] = mapped_column(String(255), nullable=True)
    estado: Mapped[str] = mapped_column(String(20), default='activo')

    roles: Mapped[list['Role']] = relationship(secondary=usuario_roles, back_populates='usuarios')
    permission_overrides: Mapped[list[UsuarioPermisoOverride]] = relationship()

    __table_args__ = (
        CheckConstraint(
            "estado IN ('activo', 'inactivo')",
            name='ck_usuarios_estado'
        ),
    )
