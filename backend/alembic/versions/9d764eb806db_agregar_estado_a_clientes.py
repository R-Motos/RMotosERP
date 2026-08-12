"""
agregar estado a clientes

Revision ID: 9d764eb806db
Revises: de9cd1a20aea
Create Date: 2026-07-23 16:22:08.654594
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = '9d764eb806db'
down_revision: Union[str, None] = 'de9cd1a20aea'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('clientes', sa.Column('estado', sa.String(length=20), nullable=False))
    with op.batch_alter_table('clientes', schema=None) as batch_op:
        batch_op.create_check_constraint(
            'ck_clientes_estado',
            "estado IN ('activo', 'inactivo')"
        )


def downgrade() -> None:
    with op.batch_alter_table('clientes', schema=None) as batch_op:
        batch_op.drop_constraint('ck_clientes_estado', type_='check')
    op.drop_column('clientes', 'estado')
