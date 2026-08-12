"""
asegurar_permisos_modulo_permisos_y_asignacion_administrador

Revision ID: b48bc39e3889
Revises: c33bea17df8a
Create Date: 2026-07-26 20:23:37.023410
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'b48bc39e3889'
down_revision: Union[str, None] = 'c33bea17df8a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


ACCIONES = ['ver', 'listar', 'crear', 'editar', 'eliminar']


def upgrade() -> None:
    conn = op.get_bind()

    existing_permisos = conn.execute(
        sa.text("SELECT modulo, accion FROM permisos WHERE modulo = 'permisos'")
    ).fetchall()
    existing_keys = {(row[0], row[1]) for row in existing_permisos}

    missing = [(a,) for a in ACCIONES if ('permisos', a) not in existing_keys]
    if missing:
        conn.execute(
            sa.text(
                "INSERT INTO permisos (modulo, accion, descripcion, created_at, updated_at) "
                "VALUES (:modulo, :accion, :descripcion, datetime('now'), datetime('now'))"
            ),
            [{'modulo': 'permisos', 'accion': row[0], 'descripcion': f"{row[0]} permisos"} for row in missing],
        )

    admin_role_id = conn.execute(
        sa.text("SELECT id FROM roles WHERE nombre = 'administrador'")
    ).scalar()
    if not admin_role_id:
        return

    permiso_ids = conn.execute(
        sa.text("SELECT id FROM permisos WHERE modulo = 'permisos'")
    ).fetchall()
    for row in permiso_ids:
        permiso_id = row[0]
        exists = conn.execute(
            sa.text("SELECT 1 FROM rol_permisos WHERE rol_id = :rol_id AND permiso_id = :permiso_id"),
            {'rol_id': admin_role_id, 'permiso_id': permiso_id},
        ).fetchone()
        if not exists:
            conn.execute(
                sa.text("INSERT INTO rol_permisos (rol_id, permiso_id) VALUES (:rol_id, :permiso_id)"),
                {'rol_id': admin_role_id, 'permiso_id': permiso_id},
            )


def downgrade() -> None:
    conn = op.get_bind()
    admin_role_id = conn.execute(
        sa.text("SELECT id FROM roles WHERE nombre = 'administrador'")
    ).scalar()
    if not admin_role_id:
        return
    permiso_ids = conn.execute(
        sa.text("SELECT id FROM permisos WHERE modulo = 'permisos'")
    ).fetchall()
    for row in permiso_ids:
        conn.execute(
            sa.text("DELETE FROM rol_permisos WHERE rol_id = :rol_id AND permiso_id = :permiso_id"),
            {'rol_id': admin_role_id, 'permiso_id': row[0]},
        )
