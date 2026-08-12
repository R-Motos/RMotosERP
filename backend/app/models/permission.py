from datetime import datetime
from sqlalchemy import CheckConstraint, Column, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Permission(Base):
    __tablename__ = 'permisos'

    modulo: Mapped[str] = mapped_column(String(50), nullable=False)
    accion: Mapped[str] = mapped_column(String(50), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(255), nullable=True)

    roles: Mapped[list['Role']] = relationship(secondary='rol_permisos', back_populates='permisos')

    __table_args__ = (
        CheckConstraint(
            "accion IN ('ver', 'listar', 'crear', 'editar', 'eliminar', 'exportar', 'importar', 'aprobar', 'anular')",
            name='ck_permisos_accion'
        ),
    )
