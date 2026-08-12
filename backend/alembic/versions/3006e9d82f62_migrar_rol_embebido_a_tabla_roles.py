"""
migrar rol embebido a tabla roles

Revision ID: 3006e9d82f62
Revises: 8ed23b6e5e84
Create Date: 2026-07-23 16:57:15.866813
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = '3006e9d82f62'
down_revision: Union[str, None] = '8ed23b6e5e84'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('roles',
        sa.Column('nombre', sa.String(length=50), nullable=False),
        sa.Column('descripcion', sa.String(length=255), nullable=True),
        sa.Column('estado', sa.String(length=20), nullable=False),
        sa.Column('es_fijo', sa.Boolean(), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.CheckConstraint("estado IN ('activo', 'inactivo')", name='ck_roles_estado'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('nombre')
    )
    op.create_index(op.f('ix_roles_id'), 'roles', ['id'], unique=False)

    op.create_table('usuario_roles',
        sa.Column('usuario_id', sa.Integer(), nullable=False),
        sa.Column('rol_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['rol_id'], ['roles.id'], ),
        sa.ForeignKeyConstraint(['usuario_id'], ['usuarios.id'], ),
        sa.PrimaryKeyConstraint('usuario_id', 'rol_id')
    )

    op.execute("""
        INSERT INTO roles (nombre, descripcion, estado, es_fijo, created_at, updated_at)
        VALUES
            ('administrador', 'Administrador del sistema', 'activo', 1, datetime('now'), datetime('now')),
            ('gestor', 'Gestor de operaciones', 'activo', 1, datetime('now'), datetime('now')),
            ('vendedor', 'Vendedor del POS', 'activo', 1, datetime('now'), datetime('now'))
    """)

    op.execute("""
        INSERT INTO usuario_roles (usuario_id, rol_id)
        SELECT u.id, r.id
        FROM usuarios u
        JOIN roles r ON r.nombre = u.rol
        WHERE u.rol IS NOT NULL
    """)

    with op.batch_alter_table('usuarios', schema=None) as batch_op:
        batch_op.drop_constraint('ck_usuarios_rol', type_='check')
        batch_op.drop_column('rol')


def downgrade() -> None:
    with op.batch_alter_table('usuarios', schema=None) as batch_op:
        batch_op.add_column(sa.Column('rol', sa.String(length=20), nullable=True))
        batch_op.create_check_constraint('ck_usuarios_rol', "rol IS NULL OR rol IN ('administrador', 'gestor', 'vendedor')")

    op.execute("""
        UPDATE usuarios
        SET rol = (
            SELECT r.nombre
            FROM usuario_roles ur
            JOIN roles r ON r.id = ur.rol_id
            WHERE ur.usuario_id = usuarios.id
            LIMIT 1
        )
    """)

    op.drop_table('usuario_roles')
    op.drop_index(op.f('ix_roles_id'), table_name='roles')
    op.drop_table('roles')
