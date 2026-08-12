from sqlalchemy.orm import Session

from app.models.permission import Permission
from app.models.role import Role


MODULOS = [
    'productos',
    'categorias',
    'marcas',
    'etiquetas',
    'clientes',
    'usuarios',
    'proveedores',
    'ordenes_compra',
    'recepciones_compra',
    'ventas',
    'movimientos',
    'finanzas',
    'configuracion',
    'dashboard',
    'auditoria',
    'pos',
    'cupones',
    'devoluciones',
    'garantias',
]

ACCIONES = ['ver', 'listar', 'crear', 'editar', 'eliminar']

ROL_PERMISOS_CONFIG = {
    'administrador': {modulo: ACCIONES for modulo in MODULOS},
    'gestor': {
        'productos': ACCIONES,
        'categorias': ACCIONES,
        'marcas': ACCIONES,
        'etiquetas': ACCIONES,
        'clientes': ACCIONES,
        'proveedores': ACCIONES,
        'ordenes_compra': ACCIONES,
        'recepciones_compra': ACCIONES,
        'ventas': ACCIONES,
        'movimientos': ACCIONES,
        'finanzas': ACCIONES,
        'dashboard': ACCIONES,
        'cupones': ACCIONES,
        'devoluciones': ACCIONES,
        'garantias': ACCIONES,
    },
    'vendedor': {
        'productos': ['ver', 'listar'],
        'clientes': ['ver', 'listar', 'crear', 'editar'],
        'ventas': ['ver', 'listar', 'crear', 'editar'],
        'dashboard': ['ver', 'listar'],
        'movimientos': ['ver', 'listar'],
        'pos': ['ver', 'listar', 'crear'],
        'cupones': ['ver', 'listar'],
    },
}


def initialize_rbac(db: Session) -> None:
    existing_permissions = db.query(Permission).all()
    if not existing_permissions:
        permiso_map: dict[tuple[str, str], Permission] = {}
        for modulo in MODULOS:
            for accion in ACCIONES:
                permiso = Permission(
                    modulo=modulo,
                    accion=accion,
                    descripcion=f'{accion} {modulo}',
                )
                db.add(permiso)
                permiso_map[(modulo, accion)] = permiso
        db.flush()
    else:
        existing_keys = {(p.modulo, p.accion) for p in existing_permissions}
        permiso_map = {(p.modulo, p.accion): p for p in existing_permissions}
        for modulo in MODULOS:
            for accion in ACCIONES:
                if (modulo, accion) not in existing_keys:
                    permiso = Permission(
                        modulo=modulo,
                        accion=accion,
                        descripcion=f'{accion} {modulo}',
                    )
                    db.add(permiso)
                    permiso_map[(modulo, accion)] = permiso
        db.flush()

    for rol_nombre, modulos_acciones in ROL_PERMISOS_CONFIG.items():
        rol = db.query(Role).filter_by(nombre=rol_nombre).first()
        if not rol:
            continue
        for modulo, acciones in modulos_acciones.items():
            for accion in acciones:
                permiso = permiso_map.get((modulo, accion))
                if permiso and permiso not in rol.permisos:
                    rol.permisos.append(permiso)
    db.commit()
