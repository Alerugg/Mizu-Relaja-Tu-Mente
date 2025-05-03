# src/api/models.py
from datetime import datetime
from uuid import uuid4
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# ───────────────────────────────  SERVICE  ───────────────────────────────
class Service(db.Model):
    __tablename__ = "service"                      # ← permanece singular

    id              = db.Column(db.Integer, primary_key=True)
    title           = db.Column(db.String(150),  nullable=False)
    subtitle        = db.Column(db.String(200),  nullable=False)
    description     = db.Column(db.Text,          nullable=False)
    predescription  = db.Column(db.Text,          nullable=False)
    allergens       = db.Column(db.Text)
    products        = db.Column(db.Text,          nullable=False)
    cost            = db.Column(db.Float,         nullable=False)
    service_type    = db.Column(db.String(50),    nullable=False)  # individual / duo

    booking_url     = db.Column(db.String(255))
    giftcard_url    = db.Column(db.String(255))                   # ⭐️ nuevo
    duration        = db.Column(db.String(50))
    location        = db.Column(db.String(255))
    includes        = db.Column(db.Text)
    benefits        = db.Column(db.Text)
    important_notes = db.Column(db.Text)
    recommended_for = db.Column(db.Text)
    image_url       = db.Column(db.String(255))                   # ⭐️ nuevo

    # relaciones
    transactions = db.relationship(
        "UserTransaction",
        backref="service",
        lazy=True,
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    gift_cards = db.relationship(
        "GiftCard",
        backref="service",
        lazy=True,
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    promotions = db.relationship(
        "Promotion",
        backref="service",
        lazy=True,
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    def __repr__(self):
        return f"<Service {self.title}>"

    def serialize(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# ─────────────────────────  USER TRANSACTION  ──────────────────────────
class UserTransaction(db.Model):
    __tablename__ = "user_transaction"

    id                 = db.Column(db.Integer, primary_key=True)
    name               = db.Column(db.String(120),  nullable=False)
    email              = db.Column(db.String(120),  nullable=False)
    phone              = db.Column(db.String(20),   nullable=False)
    transaction_number = db.Column(
        db.String(80),
        unique=True,
        nullable=False,
        default=lambda: uuid4().hex[:10].upper()
    )
    service_id = db.Column(
        db.Integer,
        db.ForeignKey("service.id", ondelete="CASCADE"),
        nullable=False
    )

    amount     = db.Column(db.Float,      nullable=False, default=0.0)
    status     = db.Column(db.String(50), nullable=False, default="pending")
    created_at = db.Column(db.DateTime,   server_default=db.func.now())

    def __repr__(self):
        return f"<UserTransaction {self.transaction_number}>"

    def serialize(self):
        out = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        out["created_at"] = out["created_at"].isoformat()
        return out


# ─────────────────────────────  GIFT CARD  ─────────────────────────────
class GiftCard(db.Model):
    __tablename__ = "gift_card"

    id             = db.Column(db.Integer, primary_key=True)
    giver_email    = db.Column(db.String(120), nullable=False)
    receiver_email = db.Column(db.String(120))
    service_id = db.Column(
        db.Integer,
        db.ForeignKey("service.id", ondelete="SET NULL")
    )

    unique_code = db.Column(
        db.String(12),
        unique=True,
        nullable=False,
        default=lambda: uuid4().hex[:12].upper()
    )
    amount      = db.Column(db.Float,  nullable=False, default=0.0)
    currency    = db.Column(db.String(3), nullable=False, default="EUR")

    is_paid     = db.Column(db.Boolean, default=False)
    is_redeemed = db.Column(db.Boolean, default=False)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    redeemed_at = db.Column(db.DateTime)

    def __repr__(self):
        return f"<GiftCard {self.unique_code}>"

    def serialize(self):
        out = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        out["created_at"] = out["created_at"].isoformat()
        if out["redeemed_at"]:
            out["redeemed_at"] = out["redeemed_at"].isoformat()
        return out


# ─────────────────────────────  PROMOTION  ─────────────────────────────
class Promotion(db.Model):
    __tablename__ = "promotion"

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text,       nullable=False)
    discount    = db.Column(db.Float,      nullable=False)  # %
    start_date  = db.Column(db.Date,       nullable=False)
    end_date    = db.Column(db.Date,       nullable=False)
    service_id  = db.Column(db.Integer,
                            db.ForeignKey("service.id"),
                            nullable=True)

    def __repr__(self):
        return f"<Promotion {self.name}>"

    def serialize(self):
        out = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        out["start_date"] = out["start_date"].isoformat()
        out["end_date"]   = out["end_date"].isoformat()
        return out


# ───────────────────────  MONTHLY STATISTICS  ────────────────────────
class MonthlyStatistics(db.Model):
    __tablename__ = "monthly_statistics"

    id   = db.Column(db.Integer, primary_key=True)
    month= db.Column(db.String(2),  nullable=False)  # "01"-"12"
    year = db.Column(db.String(4),  nullable=False)
    total_revenue             = db.Column(db.Float,   nullable=False)
    individual_services_count = db.Column(db.Integer, nullable=False)
    duo_services_count        = db.Column(db.Integer, nullable=False)
    gift_cards_sold           = db.Column(db.Integer, nullable=False)
    gift_cards_value          = db.Column(db.Float,   nullable=False)

    def __repr__(self):
        return f"<MonthlyStatistics {self.month}-{self.year}>"

    def serialize(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
