from sqlalchemy import or_
from sqlalchemy.orm import Session, selectinload

from app.models.role import Role
from app.models.user import User, usuario_roles, UsuarioPermisoOverride
from app.models.permission import Permission
from app.services import audit_service


def create(db: Session, nombre: str, username: str, email: str | None = None, telefono: str | None = None, pin: str | None = None, rol_ids: list[int] | None = None, estado: str = 'activo') -> User:
    from app.services.auth_service import hash_pin

    pin_hash = hash_pin(pin) if pin else None
    user = User(nombre=nombre, username=username, email=email, telefono=telefono, pin=None, pin_hash=pin_hash, estado=estado)
    db.add(user)
    db.flush()

    if rol_ids:
        db.execute(usuario_roles.insert().values([
            {'usuario_id': user.id, 'rol_id': rol_id} for rol_id in rol_ids
        ]))

    db.commit()
    db.refresh(user)

    from app.services import permission_service
    user.modules = permission_service.get_user_modules(db, user.id)

    audit_service.log(
        db,
        usuario_id=user.id,
        modulo='usuarios',
        accion='crear',
        registro_id=user.id,
        descripcion=f'Usuario {user.nombre} creado',
        datos_nuevos={'id': user.id, 'nombre': user.nombre, 'username': user.username},
    )

    return user


def get(db: Session, user_id: int) -> User | None:
    user = db.query(User).options(selectinload(User.roles)).get(user_id)
    if user:
        from app.services import permission_service
        user.modules = permission_service.get_user_modules(db, user_id)
    return user


def get_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def get_by_pin(db: Session, pin: str) -> User | None:
    from app.services.auth_service import verify_pin

    usuarios = db.query(User).filter(User.pin_hash.isnot(None)).all()
    for usuario in usuarios:
        if verify_pin(pin, usuario.pin_hash):
            return usuario

    usuario = db.query(User).filter(User.pin == pin).first()
    if usuario:
        from app.services.auth_service import hash_pin
        usuario.pin_hash = hash_pin(pin)
        usuario.pin = None
        db.commit()
        db.refresh(usuario)
        return usuario

    return None


def list(db: Session, estado: str | None = None, q: str | None = None) -> list[User]:
    query = db.query(User).options(selectinload(User.roles))
    if estado is None:
        query = query.filter(User.estado == 'activo')
    else:
        query = query.filter(User.estado == estado)

    if q:
        like = f'%{q}%'
        query = query.filter(
            or_(
                User.nombre.ilike(like),
                User.username.ilike(like),
            )
        )

    users = query.all()
    from app.services import permission_service
    for user in users:
        user.modules = permission_service.get_user_modules(db, user.id)
    return users


def update(db: Session, user_id: int, nombre: str | None = None, username: str | None = None, email: str | None = None, telefono: str | None = None, pin: str | None = None, rol_ids: list[int] | None = None, modules: list[str] | None = None, estado: str | None = None) -> User | None:
    from app.services.auth_service import hash_pin
    from app.models.permission import Permission

    user = get(db, user_id)
    if user:
        datos_anteriores = {
            'nombre': user.nombre,
            'username': user.username,
            'email': user.email,
            'telefono': user.telefono,
            'estado': user.estado,
        }

        if nombre is not None:
            user.nombre = nombre
        if username is not None:
            user.username = username
        if email is not None:
            user.email = email
        if telefono is not None:
            user.telefono = telefono
        if pin is not None:
            user.pin = None
            user.pin_hash = hash_pin(pin)
        if estado is not None:
            user.estado = estado

        if rol_ids is not None:
            db.execute(usuario_roles.delete().where(usuario_roles.c.usuario_id == user_id))
            if rol_ids:
                db.execute(usuario_roles.insert().values([
                    {'usuario_id': user_id, 'rol_id': rol_id} for rol_id in rol_ids
                ]))

        if modules is not None:
            current_roles = db.query(Role).join(
                usuario_roles, Role.id == usuario_roles.c.rol_id
            ).filter(
                usuario_roles.c.usuario_id == user_id,
                Role.estado == 'activo',
            ).all()

            role_modules = set()
            for rol in current_roles:
                for permiso in rol.permisos:
                    role_modules.add(permiso.modulo)

            db.query(UsuarioPermisoOverride).filter(
                UsuarioPermisoOverride.usuario_id == user_id
            ).delete(synchronize_session=False)

            all_needed = set(modules) | role_modules
            perms = db.query(Permission).filter(
                Permission.modulo.in_(all_needed),
                Permission.accion == 'ver',
            ).all()
            perm_map = {p.modulo: p for p in perms}

            for mod in modules:
                permiso = perm_map.get(mod)
                if permiso:
                    db.add(UsuarioPermisoOverride(
                        usuario_id=user_id,
                        permiso_id=permiso.id,
                        permitido=True,
                    ))

            for mod in role_modules:
                if mod not in modules:
                    permiso = perm_map.get(mod)
                    if permiso:
                        db.add(UsuarioPermisoOverride(
                            usuario_id=user_id,
                            permiso_id=permiso.id,
                            permitido=False,
                        ))

        db.commit()
        db.refresh(user)

        from app.services import permission_service
        user.modules = permission_service.get_user_modules(db, user_id)

        audit_service.log(
            db,
            usuario_id=user.id,
            modulo='usuarios',
            accion='editar',
            registro_id=user.id,
            descripcion=f'Usuario {user.nombre} actualizado',
            datos_anteriores=datos_anteriores,
            datos_nuevos={'id': user.id, 'nombre': user.nombre, 'username': user.username},
        )
    return user
