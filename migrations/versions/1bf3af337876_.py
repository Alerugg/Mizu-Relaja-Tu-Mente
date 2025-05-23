"""empty message

Revision ID: 1bf3af337876
Revises: 882f14434c50
Create Date: 2025-04-21 18:00:10.806774

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1bf3af337876'
down_revision = '882f14434c50'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('gift_card', schema=None) as batch_op:
        batch_op.add_column(sa.Column('unique_code', sa.String(length=10), nullable=False))
        batch_op.add_column(sa.Column('amount', sa.Float(), nullable=False))
        batch_op.add_column(sa.Column('currency', sa.String(length=3), nullable=True))
        batch_op.add_column(sa.Column('is_paid', sa.Boolean(), nullable=True))
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('redeemed_at', sa.DateTime(), nullable=True))
        batch_op.alter_column('is_redeemed',
               existing_type=sa.BOOLEAN(),
               nullable=True)
        batch_op.drop_constraint('gift_card_transaction_number_key', type_='unique')
        batch_op.create_unique_constraint(None, ['unique_code'])
        batch_op.drop_column('transaction_number')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('gift_card', schema=None) as batch_op:
        batch_op.add_column(sa.Column('transaction_number', sa.VARCHAR(length=80), autoincrement=False, nullable=False))
        batch_op.drop_constraint(None, type_='unique')
        batch_op.create_unique_constraint('gift_card_transaction_number_key', ['transaction_number'])
        batch_op.alter_column('is_redeemed',
               existing_type=sa.BOOLEAN(),
               nullable=False)
        batch_op.drop_column('redeemed_at')
        batch_op.drop_column('created_at')
        batch_op.drop_column('is_paid')
        batch_op.drop_column('currency')
        batch_op.drop_column('amount')
        batch_op.drop_column('unique_code')

    # ### end Alembic commands ###
