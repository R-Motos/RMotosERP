"""
agregar check constraint estado

Revision ID: 663b3c33b080
Revises: d4bdc436dec4
Create Date: 2026-07-23 16:10:04.378628
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = '663b3c33b080'
down_revision: Union[str, None] = 'd4bdc436dec4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('productos', schema=None) as batch_op:
        batch_op.create_check_constraint(
            'ck_productos_estado',
            "estado IN ('publicado', 'pendiente', 'inactivo')"
        )


def downgrade() -> None:
    with op.batch_alter_table('productos', schema=None) as batch_op:
        batch_op.drop_constraint('ck_productos_estado', type_='check')
