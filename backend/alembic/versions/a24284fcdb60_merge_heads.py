"""
merge heads

Revision ID: a24284fcdb60
Revises: a7b1c2d3e4f5, d4e5f6a7b8c9
Create Date: 2026-07-24 20:21:53.801778
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'a24284fcdb60'
down_revision: Union[str, None] = ('a7b1c2d3e4f5', 'd4e5f6a7b8c9')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
