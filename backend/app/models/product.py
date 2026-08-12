from datetime import datetime
from enum import Enum
from sqlalchemy import CheckConstraint, Column, ForeignKey, Integer, Numeric, String, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ProductoEstado(str, Enum):
    publicado = 'publicado'
    pendiente = 'pendiente'
    inactivo = 'inactivo'


producto_categoria = Table(
    'producto_categoria',
    Base.metadata,
    Column('producto_id', Integer, ForeignKey('productos.id'), primary_key=True),
    Column('categoria_id', Integer, ForeignKey('categorias.id'), primary_key=True),
)

producto_etiqueta = Table(
    'producto_etiqueta',
    Base.metadata,
    Column('producto_id', Integer, ForeignKey('productos.id'), primary_key=True),
    Column('etiqueta_id', Integer, ForeignKey('etiquetas.id'), primary_key=True),
)


class Producto(Base):
    __tablename__ = 'productos'

    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    imagen: Mapped[str] = mapped_column(String(255), nullable=True)
    sku: Mapped[str] = mapped_column(String(50), unique=True, nullable=True)
    codigo_barras: Mapped[str] = mapped_column(String(50), unique=True, nullable=True)
    precio_compra: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)
    precio_venta: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)
    gestionar_inventario: Mapped[bool] = mapped_column(default=True)
    cantidad_disponible: Mapped[int] = mapped_column(Numeric(10, 0), default=0)
    stock_minimo: Mapped[int] = mapped_column(Numeric(10, 0), default=0)
    marca_id: Mapped[int] = mapped_column(ForeignKey('marcas.id'), nullable=True)
    estado: Mapped[str] = mapped_column(String(20), default='pendiente')

    marca: Mapped['Marca'] = relationship(foreign_keys='Producto.marca_id')
    categorias: Mapped[list['Categoria']] = relationship(secondary=producto_categoria, back_populates='productos')
    etiquetas: Mapped[list['Etiqueta']] = relationship(secondary=producto_etiqueta, back_populates='productos')

    __table_args__ = (
        CheckConstraint(
            "estado IN ('publicado', 'pendiente', 'inactivo')",
            name='ck_productos_estado'
        ),
    )
