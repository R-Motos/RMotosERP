from sqlalchemy.orm import Session, selectinload

from app.models.permission import Permission
from app.models.role import Role
from app.models.user import User, usuario_roles, UsuarioPermisoOverride


def get_user_permissions(db: Session, user_id: int) -> set[str]:
    usuario = db.query(User).options(
        selectinload(User.roles).selectinload(Role.permisos)
    ).get(user_id)

    modulos: set[str] = set()
    if usuario:
        for rol in usuario.roles:
            if rol.estado == 'activo':
                for permiso in rol.permisos:
                    modulos.add(permiso.modulo)

    overrides = db.query(
        Permission.modulo,
        UsuarioPermisoOverride.permitido,
    ).join(
        Permission, UsuarioPermisoOverride.permiso_id == Permission.id,
    ).filter(
        UsuarioPermisoOverride.usuario_id == user_id,
    ).all()

    for modulo, permitido in overrides:
        if permitido:
            modulos.add(modulo)
        else:
            modulos.discard(modulo)

    return modulos


def has_permission(db: Session, user_id: int, modulo: str) -> bool:
    return modulo in get_user_permissions(db, user_id)


def get_user_modules(db: Session, user_id: int) -> list[str]:
    return sorted(get_user_permissions(db, user_id))
