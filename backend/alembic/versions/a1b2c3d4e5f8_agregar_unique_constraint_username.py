"""
agregar_unique_constraint_username

Revision ID: a1b2c3d4e5f8
Revises: a1b2c3d4e5f7
Create Date: 2026-08-09 20:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'a1b2c3d4e5f8'
down_revision: Union[str, None] = 'a1b2c3d4e5f7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('usuarios') as batch_op:
        batch_op.create_unique_constraint('uq_usuarios_username', ['username'])


def downgrade() -> None:
    with op.batch_alter_table('usuarios') as batch_op:
        batch_op.drop_constraint('uq_usuarios_username', type_='unique')
