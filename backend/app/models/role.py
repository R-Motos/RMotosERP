from datetime import datetime
from sqlalchemy import CheckConstraint, Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


rol_permisos = Table(
    'rol_permisos',
    Base.metadata,
    Column('rol_id', Integer, ForeignKey('roles.id'), primary_key=True),
    Column('permiso_id', Integer, ForeignKey('permisos.id'), primary_key=True),
)


class Role(Base):
    __tablename__ = 'roles'

    nombre: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    descripcion: Mapped[str] = mapped_column(String(255), nullable=True)
    estado: Mapped[str] = mapped_column(String(20), default='activo')
    es_fijo: Mapped[bool] = mapped_column(default=False)

    usuarios: Mapped[list['User']] = relationship(secondary='usuario_roles', back_populates='roles')
    permisos: Mapped[list['Permission']] = relationship(secondary='rol_permisos', back_populates='roles')

    __table_args__ = (
        CheckConstraint(
            "estado IN ('activo', 'inactivo')",
            name='ck_roles_estado'
        ),
    )
