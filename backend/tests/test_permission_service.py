import pytest
from sqlalchemy.orm import Session

from app.models.permission import Permission
from app.models.role import rol_permisos
from app.models.user import User, usuario_roles, UsuarioPermisoOverride
from app.services.permission_service import get_user_permissions, has_permission, get_user_modules


def test_usuario_con_un_rol(db_session: Session):
    usuario = User(nombre='Test', estado='activo')
    db_session.add(usuario)
    db_session.flush()
    db_session.execute(usuario_roles.insert().values([{'usuario_id': usuario.id, 'rol_id': 1}]))
    db_session.commit()

    permiso = Permission(modulo='ventas', accion='listar', descripcion='Listar ventas')
    db_session.add(permiso)
    db_session.flush()
    db_session.execute(rol_permisos.insert().values([{'rol_id': 1, 'permiso_id': permiso.id}]))
    db_session.commit()

    permisos = get_user_permissions(db_session, usuario.id)
    assert 'ventas' in permisos


def test_usuario_con_multiples_roles(db_session: Session):
    usuario = User(nombre='Test', estado='activo')
    db_session.add(usuario)
    db_session.flush()
    db_session.execute(usuario_roles.insert().values([
        {'usuario_id': usuario.id, 'rol_id': 1},
        {'usuario_id': usuario.id, 'rol_id': 2},
    ]))
    db_session.commit()

    p1 = Permission(modulo='ventas', accion='crear', descripcion='Crear ventas')
    p2 = Permission(modulo='compras', accion='editar', descripcion='Editar compras')
    db_session.add_all([p1, p2])
    db_session.flush()
    db_session.execute(rol_permisos.insert().values([
        {'rol_id': 1, 'permiso_id': p1.id},
        {'rol_id': 2, 'permiso_id': p2.id},
    ]))
    db_session.commit()

    permisos = get_user_permissions(db_session, usuario.id)
    assert 'ventas' in permisos
    assert 'compras' in permisos


def test_override_permitido_true(db_session: Session):
    usuario = User(nombre='Test', estado='activo')
    db_session.add(usuario)
    db_session.flush()

    permiso = Permission(modulo='ventas', accion='eliminar', descripcion='Eliminar ventas')
    db_session.add(permiso)
    db_session.flush()

    override = UsuarioPermisoOverride(
        usuario_id=usuario.id,
        permiso_id=permiso.id,
        permitido=True,
    )
    db_session.add(override)
    db_session.commit()

    permisos = get_user_permissions(db_session, usuario.id)
    assert 'ventas' in permisos


def test_override_permitido_false(db_session: Session):
    usuario = User(nombre='Test', estado='activo')
    db_session.add(usuario)
    db_session.flush()
    db_session.execute(usuario_roles.insert().values([{'usuario_id': usuario.id, 'rol_id': 1}]))
    db_session.commit()

    permiso = Permission(modulo='ventas', accion='listar', descripcion='Listar ventas')
    db_session.add(permiso)
    db_session.flush()
    db_session.execute(rol_permisos.insert().values([{'rol_id': 1, 'permiso_id': permiso.id}]))
    db_session.commit()

    override = UsuarioPermisoOverride(
        usuario_id=usuario.id,
        permiso_id=permiso.id,
        permitido=False,
    )
    db_session.add(override)
    db_session.commit()

    permisos = get_user_permissions(db_session, usuario.id)
    assert 'ventas' not in permisos


def test_multiples_overrides(db_session: Session):
    usuario = User(nombre='Test', estado='activo')
    db_session.add(usuario)
    db_session.flush()

    p1 = Permission(modulo='ventas', accion='listar', descripcion='Listar ventas')
    p2 = Permission(modulo='ventas', accion='eliminar', descripcion='Eliminar ventas')
    p3 = Permission(modulo='compras', accion='crear', descripcion='Crear compras')
    db_session.add_all([p1, p2, p3])
    db_session.flush()

    overrides = [
        UsuarioPermisoOverride(usuario_id=usuario.id, permiso_id=p1.id, permitido=True),
        UsuarioPermisoOverride(usuario_id=usuario.id, permiso_id=p2.id, permitido=False),
        UsuarioPermisoOverride(usuario_id=usuario.id, permiso_id=p3.id, permitido=True),
    ]
    db_session.add_all(overrides)
    db_session.commit()

    permisos = get_user_permissions(db_session, usuario.id)
    assert 'ventas' not in permisos
    assert 'compras' in permisos


def test_usuario_sin_permisos(db_session: Session):
    usuario = User(nombre='Test', estado='activo')
    db_session.add(usuario)
    db_session.commit()

    permisos = get_user_permissions(db_session, usuario.id)
    assert permisos == set()


def test_has_permission(db_session: Session):
    usuario = User(nombre='Test', estado='activo')
    db_session.add(usuario)
    db_session.flush()

    permiso = Permission(modulo='ventas', accion='ver', descripcion='Ver ventas')
    db_session.add(permiso)
    db_session.flush()

    override = UsuarioPermisoOverride(
        usuario_id=usuario.id,
        permiso_id=permiso.id,
        permitido=True,
    )
    db_session.add(override)
    db_session.commit()

    assert has_permission(db_session, usuario.id, 'ventas') is True
    assert has_permission(db_session, usuario.id, 'compras') is False


def test_get_user_modules(db_session: Session):
    usuario = User(nombre='Test', estado='activo')
    db_session.add(usuario)
    db_session.flush()

    p1 = Permission(modulo='ventas', accion='ver', descripcion='Ver ventas')
    p2 = Permission(modulo='ventas', accion='crear', descripcion='Crear ventas')
    p3 = Permission(modulo='compras', accion='listar', descripcion='Listar compras')
    db_session.add_all([p1, p2, p3])
    db_session.flush()

    overrides = [
        UsuarioPermisoOverride(usuario_id=usuario.id, permiso_id=p1.id, permitido=True),
        UsuarioPermisoOverride(usuario_id=usuario.id, permiso_id=p2.id, permitido=True),
        UsuarioPermisoOverride(usuario_id=usuario.id, permiso_id=p3.id, permitido=True),
    ]
    db_session.add_all(overrides)
    db_session.commit()

    modulos = get_user_modules(db_session, usuario.id)
    assert set(modulos) == {'compras', 'ventas'}
