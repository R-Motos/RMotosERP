"""
crear tabla cupones

Revision ID: c33bea17df8a
Revises: b1c2d3e4f5a6
Create Date: 2026-07-26 18:26:44.991271
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'c33bea17df8a'
down_revision: Union[str, None] = 'b1c2d3e4f5a6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'cupones',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('codigo', sa.String(50), nullable=False, unique=True),
        sa.Column('tipo', sa.String(20), nullable=False),
        sa.Column('valor', sa.Numeric(10, 2), nullable=False),
        sa.Column('fecha_inicio', sa.DateTime, nullable=False),
        sa.Column('fecha_fin', sa.DateTime, nullable=False),
        sa.Column('uso_maximo', sa.Integer, nullable=False),
        sa.Column('usos_realizados', sa.Integer, default=0),
        sa.Column('estado', sa.String(20), default='activo'),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
        sa.CheckConstraint("tipo IN ('porcentaje', 'valor_fijo')", name='ck_cupones_tipo'),
        sa.CheckConstraint("estado IN ('activo', 'inactivo')", name='ck_cupones_estado'),
        sa.CheckConstraint('uso_maximo >= 0', name='ck_cupones_uso_maximo'),
        sa.CheckConstraint('usos_realizados >= 0', name='ck_cupones_usos_realizados'),
    )


def downgrade() -> None:
    op.drop_table('cupones')
