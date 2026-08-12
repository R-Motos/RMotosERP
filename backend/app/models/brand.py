from datetime import datetime
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Marca(Base):
    __tablename__ = 'marcas'

    nombre: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
