from datetime import datetime
from sqlalchemy import CheckConstraint, Column, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class RecepcionCompra(Base):
    __tablename__ = 'recepciones_compra'

    orden_compra_id: Mapped[int] = mapped_column(ForeignKey('ordenes_compra.id'), nullable=False)
    proveedor_id: Mapped[int] = mapped_column(ForeignKey('proveedores.id'), nullable=False)
    usuario_id: Mapped[int] = mapped_column(ForeignKey('usuarios.id'), nullable=False)
    fecha: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    observaciones: Mapped[str] = mapped_column(String(255), nullable=True)
    estado: Mapped[str] = mapped_column(String(50), nullable=False)

    orden: Mapped['OrdenCompra'] = relationship(foreign_keys='RecepcionCompra.orden_compra_id')
    proveedor: Mapped['Proveedor'] = relationship(foreign_keys='RecepcionCompra.proveedor_id')
    usuario: Mapped['User'] = relationship(foreign_keys='RecepcionCompra.usuario_id')
    detalles: Mapped[list['RecepcionCompraDetalle']] = relationship(back_populates='recepcion', cascade='all, delete-orphan')

    __table_args__ = (
        CheckConstraint(
            "estado IN ('pendiente', 'completada', 'cancelada')",
            name='ck_recepciones_compra_estado'
        ),
    )


class RecepcionCompraDetalle(Base):
    __tablename__ = 'recepciones_compra_detalle'

    recepcion_id: Mapped[int] = mapped_column(ForeignKey('recepciones_compra.id'), nullable=False)
    producto_id: Mapped[int] = mapped_column(ForeignKey('productos.id'), nullable=False)
    cantidad_recibida: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)
    precio_unitario: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)

    recepcion: Mapped['RecepcionCompra'] = relationship(back_populates='detalles')
    producto: Mapped['Producto'] = relationship(foreign_keys='RecepcionCompraDetalle.producto_id')
