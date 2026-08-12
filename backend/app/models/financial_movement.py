from datetime import datetime
from sqlalchemy import CheckConstraint, Column, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class MovimientoFinanciero(Base):
    __tablename__ = 'movimientos_financieros'

    tipo: Mapped[str] = mapped_column(String(50), nullable=False)
    concepto: Mapped[str] = mapped_column(String(100), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(255), nullable=True)
    monto: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)
    fecha: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    origen: Mapped[str] = mapped_column(String(50), nullable=False)
    referencia_id: Mapped[int] = mapped_column(nullable=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey('usuarios.id'), nullable=False)

    usuario: Mapped['User'] = relationship(foreign_keys='MovimientoFinanciero.usuario_id')

    __table_args__ = (
        CheckConstraint(
            "tipo IN ('ingreso', 'egreso')",
            name='ck_movimientos_financieros_tipo'
        ),
        CheckConstraint(
            "origen IN ('venta', 'compra', 'manual')",
            name='ck_movimientos_financieros_origen'
        ),
    )
