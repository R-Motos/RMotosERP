"""
cambiar stock a entero

Revision ID: b1c2d3e4f5a6
Revises: a24284fcdb60
Create Date: 2026-07-24 20:20:00
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'b1c2d3e4f5a6'
down_revision: Union[str, None] = 'a24284fcdb60'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('productos') as batch_op:
        batch_op.alter_column('cantidad_disponible', type_=sa.Integer, existing_type=sa.Numeric(precision=10, scale=3))
        batch_op.alter_column('stock_minimo', type_=sa.Integer, existing_type=sa.Numeric(precision=10, scale=3))


def downgrade() -> None:
    with op.batch_alter_table('productos') as batch_op:
        batch_op.alter_column('cantidad_disponible', type_=sa.Numeric(precision=10, scale=3), existing_type=sa.Integer)
        batch_op.alter_column('stock_minimo', type_=sa.Numeric(precision=10, scale=3), existing_type=sa.Integer)
