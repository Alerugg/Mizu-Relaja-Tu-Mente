"""empty message

Revision ID: 5c512f03a2ad
Revises: 1f3f5ed5d980
Create Date: 2024-12-06 17:04:09.034760

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5c512f03a2ad'
down_revision = '1f3f5ed5d980'
branch_labels = None
depends_on = None


def upgrade():
    # Eliminar esta línea porque la tabla no existe
    # op.drop_table('playing_with_neon')
    pass


def downgrade():
    # También puedes comentar esta parte si no necesitas recuperarla
    # op.create_table('playing_with_neon',
    #     sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    #     sa.Column('name', sa.TEXT(), autoincrement=False, nullable=False),
    #     sa.Column('value', sa.REAL(), autoincrement=False, nullable=True),
    #     sa.PrimaryKeyConstraint('id', name='playing_with_neon_pkey')
    # )
    pass
