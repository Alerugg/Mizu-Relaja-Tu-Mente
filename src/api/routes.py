"""
Rutas REST de la API Mizu
– users / services / transactions / promotions
– gift‑cards (checkout, webhook, redeem, status)
"""
from uuid import uuid4
from datetime import datetime
from flask import Blueprint, request, jsonify
from api.models import (
    db,
    UserTransaction,
    Service,
    Promotion,
    GiftCard,
)

api = Blueprint("api", __name__)

# -------------------------------------------------------------------
#  USER‑TRANSACTIONS
# -------------------------------------------------------------------
@api.route("/users", methods=["POST"])
def create_user():
    data = request.get_json() or {}
    new_user = UserTransaction(
        name=data["name"],
        email=data["email"],
        phone=data["phone"],
        transaction_number=data["transaction_number"],
        service_id=data["service_id"],
    )
    db.session.add(new_user); db.session.commit()
    return jsonify(new_user.serialize()), 201


@api.route("/users/<int:user_id>")
def get_user(user_id):
    user = UserTransaction.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user.serialize()), 200


@api.route("/users")
def get_all_users():
    return jsonify([u.serialize() for u in UserTransaction.query.all()])

# -------------------------------------------------------------------
#  SERVICES
# -------------------------------------------------------------------
@api.route("/services")
def get_services():
    return jsonify([s.serialize() for s in Service.query.all()])

@api.route("/services/<string:stype>")
def get_services_by_type(stype):
    services = Service.query.filter_by(service_type=stype).all()
    return jsonify([s.serialize() for s in services])

@api.route("/services", methods=["POST"])
def create_service():
    d = request.get_json() or {}
    srv = Service(
        title=d["title"],
        subtitle=d["subtitle"],
        description=d["description"],
        predescription=d["predescription"],
        allergens=d.get("allergens"),
        products=d["products"],
        cost=d["cost"],
        service_type=d["service_type"],
        booking_url=d.get("booking_url"),
        duration=d.get("duration"),
        location=d.get("location"),
        includes=d.get("includes"),
        benefits=d.get("benefits"),
        important_notes=d.get("important_notes"),
        recommended_for=d.get("recommended_for"),
        image=d.get("image")
    )
    db.session.add(srv)
    db.session.commit()
    return jsonify(srv.serialize()), 201


@api.route("/services/<int:sid>", methods=["PUT"])
def update_service(sid):
    srv = Service.query.get(sid)
    if not srv:
        return jsonify({"msg": "Service not found"}), 404
    d = request.get_json() or {}
    for field in (
        "title",
        "subtitle",
        "description",
        "allergens",
        "products",
        "cost",
        "service_type",
        "booking_url",
    ):
        if field in d:
            setattr(srv, field, d[field])
    db.session.commit()
    return jsonify(srv.serialize()), 200


@api.route("/services/<int:sid>", methods=["DELETE"])
def delete_service(sid):
    srv = Service.query.get(sid)
    if not srv:
        return jsonify({"msg": "Service not found"}), 404
    db.session.delete(srv); db.session.commit()
    return jsonify({"msg": "Service deleted"}), 200

# -------------------------------------------------------------------
#  TRANSACTIONS
# -------------------------------------------------------------------
@api.route("/transactions", methods=["POST"])
def create_tx():
    d = request.get_json() or {}
    srv = Service.query.get(d["service_id"])
    if not srv:
        return jsonify({"msg": "Service not found"}), 404
    tx = UserTransaction(
        name=d["name"],
        email=d["email"],
        phone=d["phone"],
        transaction_number=d["transaction_number"],
        service_id=srv.id,
    )
    db.session.add(tx); db.session.commit()
    return jsonify(tx.serialize()), 201


@api.route("/transactions")
def list_tx():
    return jsonify([t.serialize() for t in UserTransaction.query.all()])


@api.route("/transactions/<int:tid>")
def get_tx(tid):
    tx = UserTransaction.query.get(tid)
    if not tx:
        return jsonify({"msg": "Transaction not found"}), 404
    return jsonify(tx.serialize()), 200

# -------------------------------------------------------------------
#  PROMOTIONS  (si las usas)
# -------------------------------------------------------------------
#  … mantén aquí tus endpoints de promociones …

# -------------------------------------------------------------------
#  GIFT‑CARDS
# -------------------------------------------------------------------
@api.route("/gift-cards/checkout", methods=["POST"])
def gc_checkout():
    d = request.get_json() or {}
    srv = Service.query.get(d["service_id"])
    if not srv:
        return jsonify({"msg": "Service not found"}), 404

    gc = GiftCard(
        giver_email=d["giver_email"],
        receiver_email=d.get("receiver_email"),
        service_id=srv.id,
        amount=srv.cost,
        unique_code=uuid4().hex[:8].upper(),
    )
    db.session.add(gc); db.session.commit()

    checkout_url = f"https://checkout.stripe.com/pay/session-{gc.id}"  # placeholder
    return jsonify({"gift_card_id": gc.id, "checkout_url": checkout_url}), 201


@api.route("/webhooks/stripe", methods=["POST"])
def stripe_webhook():
    # TODO: validar firma y marcar is_paid=True
    return "", 200


@api.route("/gift-cards/redeem", methods=["POST"])
def gc_redeem():
    code = request.json.get("code", "").upper()
    gc = GiftCard.query.filter_by(unique_code=code).first()
    if not gc or not gc.is_paid:
        return jsonify({"msg": "Código inválido"}), 400
    if gc.is_redeemed:
        return jsonify({"msg": "Código ya utilizado"}), 409
    gc.is_redeemed, gc.redeemed_at = True, datetime.utcnow()
    db.session.commit()
    return jsonify(gc.serialize()), 200


@api.route("/gift-cards/<string:code>")
def gc_status(code):
    gc = GiftCard.query.filter_by(unique_code=code.upper()).first()
    if not gc:
        return jsonify({"msg": "Not found"}), 404
    return jsonify(gc.serialize())


@api.route("/gift-cards")
def gc_list():
    return jsonify([g.serialize() for g in GiftCard.query.all()])
