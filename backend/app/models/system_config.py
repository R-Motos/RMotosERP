from datetime import datetime
from sqlalchemy import Column, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class SystemConfig(Base):
    __tablename__ = 'system_config'

    nombre_negocio: Mapped[str] = mapped_column(String(100), nullable=False, default='')
    nit: Mapped[str] = mapped_column(String(20), nullable=False, default='')
    telefono: Mapped[str] = mapped_column(String(20), nullable=False, default='')
    email: Mapped[str] = mapped_column(String(100), nullable=False, default='')
    direccion: Mapped[str] = mapped_column(String(255), nullable=False, default='')
    ciudad: Mapped[str] = mapped_column(String(100), nullable=False, default='')
    logo: Mapped[str] = mapped_column(String(255), nullable=True)
    moneda: Mapped[str] = mapped_column(String(50), nullable=False, default='COP')
    simbolo_moneda: Mapped[str] = mapped_column(String(10), nullable=False, default='$')
