from datetime import datetime
from sqlalchemy import CheckConstraint, Column, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Cliente(Base):
    __tablename__ = 'clientes'

    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=True)
    telefono: Mapped[str] = mapped_column(String(50), nullable=True)
    cantidad_compras: Mapped[int] = mapped_column(Integer, default=0)
    total_gastado: Mapped[int] = mapped_column(Numeric(10, 0), default=0)
    estado: Mapped[str] = mapped_column(String(20), default='activo')

    __table_args__ = (
        CheckConstraint(
            "estado IN ('activo', 'inactivo')",
            name='ck_clientes_estado'
        ),
    )
