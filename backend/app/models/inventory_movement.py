from datetime import datetime
from enum import Enum
from sqlalchemy import CheckConstraint, Column, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class MovimientoTipo(str, Enum):
    entrada = 'entrada'
    salida = 'salida'
    ajuste = 'ajuste'


class MovimientoInventario(Base):
    __tablename__ = 'movimientos_inventario'

    producto_id: Mapped[int] = mapped_column(ForeignKey('productos.id'), nullable=False)
    tipo: Mapped[str] = mapped_column(String(20), nullable=False)
    cantidad: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)
    observaciones: Mapped[str] = mapped_column(String(255), nullable=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey('usuarios.id'), nullable=False)
    referencia: Mapped[str] = mapped_column(String(100), nullable=True)

    __table_args__ = (
        CheckConstraint(
            "tipo IN ('entrada', 'salida', 'ajuste')",
            name='ck_movimientos_tipo'
        ),
    )
