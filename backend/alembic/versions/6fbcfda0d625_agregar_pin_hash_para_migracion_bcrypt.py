"""
agregar pin_hash para migracion bcrypt

Revision ID: 6fbcfda0d625
Revises: 0538266aae50
Create Date: 2026-07-23 17:19:54.390704
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = '6fbcfda0d625'
down_revision: Union[str, None] = '0538266aae50'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('usuarios', sa.Column('pin_hash', sa.String(length=255), nullable=True))


def downgrade() -> None:
    op.drop_column('usuarios', 'pin_hash')
