from datetime import datetime
from sqlalchemy import CheckConstraint, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class AuditLog(Base):
    __tablename__ = 'audit_logs'

    usuario_id: Mapped[int] = mapped_column(ForeignKey('usuarios.id'), nullable=False)
    modulo: Mapped[str] = mapped_column(String(50), nullable=False)
    accion: Mapped[str] = mapped_column(String(20), nullable=False)
    registro_id: Mapped[int] = mapped_column(Integer, nullable=False)
    descripcion: Mapped[str] = mapped_column(String(255), nullable=False)
    datos_anteriores: Mapped[str] = mapped_column(Text, nullable=True)
    datos_nuevos: Mapped[str] = mapped_column(Text, nullable=True)

    usuario: Mapped['User'] = relationship(foreign_keys='AuditLog.usuario_id')

    __table_args__ = (
        CheckConstraint(
            "accion IN ('crear', 'editar', 'eliminar', 'anular', 'aprobar', 'login', 'logout')",
            name='ck_audit_logs_accion'
        ),
    )
