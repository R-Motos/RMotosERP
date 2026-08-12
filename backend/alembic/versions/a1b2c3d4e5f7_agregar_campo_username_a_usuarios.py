"""
agregar_campo_username_a_usuarios

Revision ID: a1b2c3d4e5f7
Revises: b48bc39e3889
Create Date: 2026-08-09 18:53:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'a1b2c3d4e5f7'
down_revision: Union[str, None] = 'b48bc39e3889'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('usuarios') as batch_op:
        batch_op.add_column(sa.Column('username', sa.String(length=50), nullable=True))
    
    op.execute("UPDATE usuarios SET username = 'user_' || id WHERE username IS NULL")
    
    with op.batch_alter_table('usuarios') as batch_op:
        batch_op.alter_column('username', nullable=False)
        batch_op.create_unique_constraint('uq_usuarios_username', ['username'])


def downgrade() -> None:
    with op.batch_alter_table('usuarios') as batch_op:
        batch_op.drop_constraint('uq_usuarios_username', type_='unique')
        batch_op.drop_column('username')
