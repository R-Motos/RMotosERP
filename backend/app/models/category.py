from datetime import datetime
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Categoria(Base):
    __tablename__ = 'categorias'

    nombre: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    productos: Mapped[list['Producto']] = relationship(secondary='producto_categoria', back_populates='categorias')
