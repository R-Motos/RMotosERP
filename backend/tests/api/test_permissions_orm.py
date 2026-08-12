import pytest
from sqlalchemy.orm import Session

from app.models.permission import Permission
from app.models.role import Role, rol_permisos
from app.models.user import User, UsuarioPermisoOverride


def test_create_permission(db_session: Session):
    permiso = Permission(modulo='ventas', accion='crear', descripcion='Crear ventas')
    db_session.add(permiso)
    db_session.commit()
    assert permiso.id is not None
    assert permiso.modulo == 'ventas'
    assert permiso.accion == 'crear'


def test_role_permission_association(db_session: Session):
    rol = Role(nombre='test_rol', descripcion='Test', estado='activo', es_fijo=False)
    permiso = Permission(modulo='ventas', accion='listar', descripcion='Listar ventas')
    db_session.add_all([rol, permiso])
    db_session.commit()

    rol.permisos.append(permiso)
    db_session.commit()

    assert len(rol.permisos) == 1
    assert rol.permisos[0].modulo == 'ventas'
    assert rol.permisos[0].accion == 'listar'
    assert len(permiso.roles) == 1
    assert permiso.roles[0].nombre == 'test_rol'


def test_user_permission_override(db_session: Session):
    usuario = User(nombre='Test User', estado='activo')
    permiso = Permission(modulo='compras', accion='eliminar', descripcion='Eliminar compras')
    db_session.add_all([usuario, permiso])
    db_session.commit()

    override = UsuarioPermisoOverride(
        usuario_id=usuario.id,
        permiso_id=permiso.id,
        permitido=True,
    )
    db_session.add(override)
    db_session.commit()

    assert override.usuario_id == usuario.id
    assert override.permiso_id == permiso.id
    assert override.permitido is True
    assert len(usuario.permission_overrides) == 1
    assert usuario.permission_overrides[0].permitido is True
