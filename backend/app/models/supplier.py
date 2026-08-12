from datetime import datetime
from sqlalchemy import CheckConstraint, Column, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Proveedor(Base):
    __tablename__ = 'proveedores'

    nombre: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    nit: Mapped[str] = mapped_column(String(50), nullable=True, unique=True)
    contacto: Mapped[str] = mapped_column(String(100), nullable=True)
    telefono: Mapped[str] = mapped_column(String(50), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=True)
    direccion: Mapped[str] = mapped_column(String(255), nullable=True)
    ciudad: Mapped[str] = mapped_column(String(100), nullable=True)
    observaciones: Mapped[str] = mapped_column(String(255), nullable=True)
    estado: Mapped[str] = mapped_column(String(20), default='activo')

    __table_args__ = (
        CheckConstraint(
            "estado IN ('activo', 'inactivo')",
            name='ck_proveedores_estado'
        ),
    )
