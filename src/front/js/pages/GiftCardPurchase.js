// ──────────────────────────────────────────────────────────────
// src/pages/GiftCardPurchase.jsx
// ──────────────────────────────────────────────────────────────
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";          //  ← tu Flux
import "../../styles/giftcard.css";

export function GiftCardPurchase() {
  const { store, actions } = useContext(Context);

  /* 1 . Descarga servicios una sola vez */
  useEffect(() => { actions.fetchServices(); }, []);

  /* 2 . UI state */
  const [category, setCategory] = useState("individual");   // pestaña activa
  const [form, setForm] = useState({
    giver_email:    "",
    receiver_email: "",
    service_id:     ""
  });
  const [error, setError] = useState("");

  /* 3 . Lista filtrada por pestaña */
  const visibles =
    category === "individual" ? store.servicesIndividuales : store.servicesDuos;

  /* cuando cambia la lista auto-selecciona el 1.º si no hay ninguno */
  useEffect(() => {
    if (visibles.length && !form.service_id) {
      setForm(f => ({ ...f, service_id: visibles[0].id }));
    }
  }, [visibles]);

  /* ───── helpers ───── */
  const handleInput = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const selectService = id =>
    setForm({ ...form, service_id: id });

  /* 4 . Submit → redirige directo al enlace de Stripe */
  const handleSubmit = e => {
    e.preventDefault();
    const chosen = store.services.find(s => s.id === form.service_id);

    if (!chosen?.giftcard_url) {            // ⚠️ usamos giftcard_url
      setError("No se encontró enlace de pago para ese servicio.");
      return;
    }

    /* ➜ Opcionalmente envía los e-mails al backend aquí … */

    window.location.href = chosen.giftcard_url;   // ← Stripe Checkout
  };

  return (
    <section className="gc-section">

      <h1 className="gc-title">Regala bienestar con Mizu</h1>
      {error && <p className="gc-error">{error}</p>}

      {/* ── pestañas ─────────────────── */}
      <div className="gc-tabs">
        <button
          className={category === "individual" ? "active" : ""}
          onClick={() => { setCategory("individual"); setForm(f=>({...f,service_id:""})); }}
        >
          Individuales
        </button>
        <button
          className={category === "duo" ? "active" : ""}
          onClick={() => { setCategory("duo"); setForm(f=>({...f,service_id:""})); }}
        >
          Parejas
        </button>
      </div>

      {/* ── lista tipo “pill” ─────────── */}
      <div className="gc-pill-list">
        {visibles.map(s => (
          <label key={s.id} className="gc-pill-wrapper">
            <input
              type="radio"
              name="service_id"
              value={s.id}
              checked={form.service_id === s.id}
              onChange={() => selectService(s.id)}
            />
            <span className="gc-pill">
              <span className="gc-pill-title">{s.title}</span>
              <span className="gc-pill-price">€{s.cost.toFixed(2)}</span>
            </span>
          </label>
        ))}
      </div>

      {/* ── formulario ───────────────── */}
      <form className="gc-form" onSubmit={handleSubmit}>
        <div className="gc-form-group">
          <label>Tu e-mail*</label>
          <input
            type="email"
            name="giver_email"
            value={form.giver_email}
            onChange={handleInput}
            required
          />
        </div>

        <div className="gc-form-group">
          <label>E-mail del destinatario (opcional)</label>
          <input
            type="email"
            name="receiver_email"
            value={form.receiver_email}
            onChange={handleInput}
          />
        </div>

        <button className="gc-btn">Ir a pago seguro</button>
      </form>
    </section>
  );
}
