from datetime import datetime
from sqlalchemy import CheckConstraint, Column, DateTime, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Cupon(Base):
    __tablename__ = 'cupones'

    codigo: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    tipo: Mapped[str] = mapped_column(String(20), nullable=False)
    valor: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)
    fecha_inicio: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    fecha_fin: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    uso_maximo: Mapped[int] = mapped_column(Integer, nullable=False)
    usos_realizados: Mapped[int] = mapped_column(Integer, default=0)
    estado: Mapped[str] = mapped_column(String(20), default='activo')

    __table_args__ = (
        CheckConstraint(
            "tipo IN ('porcentaje', 'valor_fijo')",
            name='ck_cupones_tipo'
        ),
        CheckConstraint(
            "estado IN ('activo', 'inactivo')",
            name='ck_cupones_estado'
        ),
        CheckConstraint(
            "uso_maximo >= 0",
            name='ck_cupones_uso_maximo'
        ),
        CheckConstraint(
            "usos_realizados >= 0",
            name='ck_cupones_usos_realizados'
        ),
    )
