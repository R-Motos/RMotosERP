import json
from decimal import Decimal
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from app.models.user import User


ACCIONES_PERMITIDAS = {'crear', 'editar', 'eliminar', 'anular', 'aprobar', 'login', 'logout'}


def _json_default(obj):
    if isinstance(obj, Decimal):
        return str(obj)
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")


def _serialize(data: dict | None) -> str | None:
    if data is None:
        return None
    return json.dumps(data, default=_json_default)


def _deserialize(data: str | None) -> dict | None:
    if data is None:
        return None
    return json.loads(data)


def log(db: Session, usuario_id: int, modulo: str, accion: str, registro_id: int, descripcion: str, datos_anteriores: dict | None = None, datos_nuevos: dict | None = None) -> AuditLog:
    if accion not in ACCIONES_PERMITIDAS:
        raise ValueError('Acción no permitida')

    usuario = db.get(User, usuario_id)
    if not usuario:
        raise ValueError('Usuario no encontrado')

    audit_log = AuditLog(
        usuario_id=usuario_id,
        modulo=modulo,
        accion=accion,
        registro_id=registro_id,
        descripcion=descripcion,
        datos_anteriores=_serialize(datos_anteriores),
        datos_nuevos=_serialize(datos_nuevos),
    )
    db.add(audit_log)
    db.commit()
    db.refresh(audit_log)
    return audit_log


def get(db: Session, audit_id: int) -> AuditLog | None:
    return db.get(AuditLog, audit_id)


def list(db: Session, usuario_id: int | None = None, modulo: str | None = None, accion: str | None = None, fecha_inicio: datetime | None = None, fecha_fin: datetime | None = None, page: int = 1, size: int = 20) -> dict:
    from datetime import datetime as dt
    
    query = db.query(AuditLog)

    if usuario_id is not None:
        query = query.filter(AuditLog.usuario_id == usuario_id)
    if modulo:
        query = query.filter(AuditLog.modulo == modulo)
    if accion:
        query = query.filter(AuditLog.accion == accion)
    if fecha_inicio:
        query = query.filter(AuditLog.created_at >= fecha_inicio)
    if fecha_fin:
        query = query.filter(AuditLog.created_at <= fecha_fin)

    total = query.count()
    items = query.order_by(AuditLog.created_at.desc()).offset((page - 1) * size).limit(size).all()

    return {
        'items': items,
        'total': total,
        'page': page,
        'size': size,
    }
