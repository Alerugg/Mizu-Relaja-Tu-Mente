# api/models.py
from datetime import datetime
from uuid import uuid4
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# --------------------  TRANSACCIONES  --------------------
class UserTransaction(db.Model):
    id   = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email= db.Column(db.String(120), nullable=False)
    phone= db.Column(db.String(20),  nullable=False)
    transaction_number = db.Column(db.String(80), unique=True, nullable=False)
    service_id         = db.Column(db.Integer,
                                   db.ForeignKey("service.id"),
                                   nullable=False)

    def __repr__(self):
        return f"<UserTransaction {self.transaction_number}>"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "transaction_number": self.transaction_number,
            "service_id": self.service_id,
        }

# --------------------  SERVICIOS  --------------------
class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    subtitle = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    predescription = db.Column(db.Text, nullable=False)
    allergens = db.Column(db.Text, nullable=True)
    products = db.Column(db.Text, nullable=False)
    cost = db.Column(db.Float, nullable=False)
    service_type = db.Column(db.String(50), nullable=False)  # individual / duo
    booking_url = db.Column(db.String(255), nullable=True)
    duration = db.Column(db.String(50), nullable=True)
    location = db.Column(db.String(255), nullable=True)
    includes = db.Column(db.Text, nullable=True)
    benefits = db.Column(db.Text, nullable=True)
    important_notes = db.Column(db.Text, nullable=True)
    recommended_for = db.Column(db.Text, nullable=True)
    image = db.Column(db.String(255), nullable=True)

    transactions = db.relationship("UserTransaction", backref="service", lazy=True)

    def __repr__(self):
        return f"<Service {self.title}>"

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "subtitle": self.subtitle,
            "description": self.description,
            "predescription": self.predescription,
            "allergens": self.allergens,
            "products": self.products,
            "cost": self.cost,
            "service_type": self.service_type,
            "booking_url": self.booking_url,
            "duration": self.duration,
            "location": self.location,
            "includes": self.includes,
            "benefits": self.benefits,
            "important_notes": self.important_notes,
            "recommended_for": self.recommended_for,
            "image": self.image
        }

# --------------------  PROMOCIONES  --------------------
class Promotion(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text,       nullable=False)
    discount    = db.Column(db.Float,      nullable=False)
    start_date  = db.Column(db.Date,       nullable=False)
    end_date    = db.Column(db.Date,       nullable=False)
    service_id  = db.Column(db.Integer, db.ForeignKey("service.id"), nullable=True)

    def __repr__(self):
        return f"<Promotion {self.name}>"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "discount": self.discount,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "service_id": self.service_id,
        }

# --------------------  GIFT‑CARDS  --------------------
class GiftCard(db.Model):
    id             = db.Column(db.Integer, primary_key=True)
    giver_email    = db.Column(db.String(120), nullable=False)
    receiver_email = db.Column(db.String(120), nullable=True)
    service_id     = db.Column(db.Integer, db.ForeignKey("service.id"), nullable=False)

    unique_code    = db.Column(db.String(10), nullable=False, unique=True)
    amount         = db.Column(db.Float,     nullable=False, default=0.0)
    currency       = db.Column(db.String(3), default="EUR")

    is_paid     = db.Column(db.Boolean, default=False)      # confirmado por webhook
    is_redeemed = db.Column(db.Boolean, default=False)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    redeemed_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f"<GiftCard {self.unique_code}>"

    def serialize(self):
        return {
            "id": self.id,
            "giver_email":    self.giver_email,
            "receiver_email": self.receiver_email,
            "service_id":     self.service_id,
            "unique_code":    self.unique_code,
            "amount":         self.amount,
            "currency":       self.currency,
            "is_paid":        self.is_paid,
            "is_redeemed":    self.is_redeemed,
            "created_at":     self.created_at.isoformat(),
            "redeemed_at":    self.redeemed_at.isoformat() if self.redeemed_at else None,
        }

# --------------------  ESTADÍSTICAS  --------------------
class MonthlyStatistics(db.Model):
    id   = db.Column(db.Integer, primary_key=True)
    month= db.Column(db.String(2),  nullable=False)  # 01‑12
    year = db.Column(db.String(4),  nullable=False)
    total_revenue            = db.Column(db.Float,   nullable=False)
    individual_services_count= db.Column(db.Integer, nullable=False)
    duo_services_count       = db.Column(db.Integer, nullable=False)
    gift_cards_sold          = db.Column(db.Integer, nullable=False)
    gift_cards_value         = db.Column(db.Float,   nullable=False)

    def __repr__(self):
        return f"<MonthlyStatistics {self.month}-{self.year}>"

    def serialize(self):
        return {
            "id": self.id,
            "month": self.month,
            "year": self.year,
            "total_revenue": self.total_revenue,
            "individual_services_count": self.individual_services_count,
            "duo_services_count": self.duo_services_count,
            "gift_cards_sold": self.gift_cards_sold,
            "gift_cards_value": self.gift_cards_value,
        }
