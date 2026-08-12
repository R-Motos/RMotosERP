from datetime import datetime
from sqlalchemy import CheckConstraint, Column, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class OrdenCompra(Base):
    __tablename__ = 'ordenes_compra'

    numero: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    proveedor_id: Mapped[int] = mapped_column(ForeignKey('proveedores.id'), nullable=False)
    usuario_id: Mapped[int] = mapped_column(ForeignKey('usuarios.id'), nullable=False)
    estado: Mapped[str] = mapped_column(String(50), nullable=False)
    observaciones: Mapped[str] = mapped_column(String(255), nullable=True)
    total: Mapped[int] = mapped_column(Numeric(10, 0), default=0)

    proveedor: Mapped['Proveedor'] = relationship(foreign_keys='OrdenCompra.proveedor_id')
    usuario: Mapped['User'] = relationship(foreign_keys='OrdenCompra.usuario_id')
    detalles: Mapped[list['OrdenCompraDetalle']] = relationship(back_populates='orden', cascade='all, delete-orphan')

    __table_args__ = (
        CheckConstraint(
            "estado IN ('borrador', 'enviada', 'parcialmente_recibida', 'completada', 'cancelada')",
            name='ck_ordenes_compra_estado'
        ),
    )


class OrdenCompraDetalle(Base):
    __tablename__ = 'ordenes_compra_detalle'

    orden_id: Mapped[int] = mapped_column(ForeignKey('ordenes_compra.id'), nullable=False)
    producto_id: Mapped[int] = mapped_column(ForeignKey('productos.id'), nullable=False)
    cantidad: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)
    precio_unitario: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)
    subtotal: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)

    orden: Mapped['OrdenCompra'] = relationship(back_populates='detalles')
    producto: Mapped['Producto'] = relationship(foreign_keys='OrdenCompraDetalle.producto_id')
