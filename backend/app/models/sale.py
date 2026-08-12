from datetime import datetime
from sqlalchemy import CheckConstraint, Column, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Venta(Base):
    __tablename__ = 'ventas'

    numero: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    usuario_id: Mapped[int] = mapped_column(ForeignKey('usuarios.id'), nullable=False)
    cliente_id: Mapped[int] = mapped_column(ForeignKey('clientes.id'), nullable=True)
    fecha_venta: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    subtotal: Mapped[int] = mapped_column(Numeric(10, 0), default=0)
    descuento: Mapped[int] = mapped_column(Numeric(10, 0), default=0)
    total: Mapped[int] = mapped_column(Numeric(10, 0), default=0)
    metodo_pago: Mapped[str] = mapped_column(String(50), nullable=False)
    estado: Mapped[str] = mapped_column(String(50), nullable=False)

    usuario: Mapped['User'] = relationship(foreign_keys='Venta.usuario_id')
    cliente: Mapped['Cliente'] = relationship(foreign_keys='Venta.cliente_id')
    detalles: Mapped[list['VentaDetalle']] = relationship(back_populates='venta', cascade='all, delete-orphan')

    __table_args__ = (
        CheckConstraint(
            "estado IN ('pendiente', 'completada', 'anulada')",
            name='ck_ventas_estado'
        ),
        CheckConstraint(
            "metodo_pago IN ('efectivo', 'transferencia', 'tarjeta', 'otro')",
            name='ck_ventas_metodo_pago'
        ),
    )

    @property
    def cliente_nombre(self):
        return self.cliente.nombre if self.cliente else None


class VentaDetalle(Base):
    __tablename__ = 'venta_detalles'

    venta_id: Mapped[int] = mapped_column(ForeignKey('ventas.id'), nullable=False)
    producto_id: Mapped[int] = mapped_column(ForeignKey('productos.id'), nullable=False)
    cantidad: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)
    precio_unitario: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)
    descuento: Mapped[int] = mapped_column(Numeric(10, 0), default=0)
    subtotal: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)

    venta: Mapped['Venta'] = relationship(back_populates='detalles')
    producto: Mapped['Producto'] = relationship(foreign_keys='VentaDetalle.producto_id')
