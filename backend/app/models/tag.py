from datetime import datetime
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Etiqueta(Base):
    __tablename__ = 'etiquetas'

    nombre: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    productos: Mapped[list['Producto']] = relationship(secondary='producto_etiqueta', back_populates='etiquetas')
