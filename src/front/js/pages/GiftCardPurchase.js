// ──────────────────────────────────────────────────────────────
// src/pages/GiftCardPurchase.jsx
// ──────────────────────────────────────────────────────────────
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/giftcard.css";

/* ─── NÚMERO DE WHATSAPP receptor (sin +) ─── */
const WHATSAPP = "34691352596";

export function GiftCardPurchase() {
  const { store, actions } = useContext(Context);

  /* 1 . Trae servicios una vez */
  useEffect(() => { actions.fetchServices(); }, []);

  /* 2 . Estado UI */
  const [category, setCategory] = useState("individual");
  const [form, setForm] = useState({
    buyerName:       "",
    buyerEmail:      "",
    recipientName:   "",
    recipientEmail:  "",
    sendByMizu:      "yes",    // yes | no
    service_id:      ""
  });
  const [error, setError] = useState("");

  /* 3 . Filtra por pestaña */
  const visibles = category === "individual"
    ? store.servicesIndividuales
    : store.servicesDuos;

  /* si cambia la lista, autoselecciona el 1.º */
  useEffect(() => {
    if (visibles.length && !form.service_id) {
      setForm(f => ({ ...f, service_id: visibles[0].id }));
    }
  }, [visibles]);

  /* ─── helpers ─── */
  const handleInput  = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const selectService = id =>
    setForm({ ...form, service_id: id });

  /* 4 . Submit → abre WhatsApp */
  const handleSubmit = e => {
    e.preventDefault();

    /* validación mínima */
    if (!form.buyerName || !form.buyerEmail) {
      setError("Introduce tu nombre y e-mail.");
      return;
    }
    const chosen = store.services.find(s => s.id === form.service_id);
    if (!chosen) {
      setError("Selecciona un servicio.");
      return;
    }

    /* mensaje multilinea */
    const msg =
      `Hola, estoy interesado en la Gift-Card “${chosen.title}” ` +
      `(${chosen.cost.toFixed(2)} €).\n\n` +
      `Datos de quien paga:\n` +
      `• Nombre: ${form.buyerName}\n` +
      `• Email: ${form.buyerEmail}\n` +
      (form.recipientName || form.recipientEmail
        ? `\nDatos del destinatario:\n` +
          (form.recipientName  ? `• Nombre: ${form.recipientName}\n`  : "") +
          (form.recipientEmail ? `• Email: ${form.recipientEmail}\n` : "")
        : "") +
      `\n¿Queréis que Mizu envíe la tarjeta?: ` +
      (form.sendByMizu === "yes" ? "Sí, por favor." : "No, la enviaré yo.");

    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="gc-section">
      <h1 className="gc-title">Regala bienestar con Mizu</h1>
      {error && <p className="gc-error">{error}</p>}

      {/* ─── pestañas ─── */}
      <div className="gc-tabs">
        <button
          className={category==="individual" ? "active":""}
          onClick={() => { setCategory("individual"); setForm(f=>({...f,service_id:""})); }}
        >
          Individuales
        </button>
        <button
          className={category==="duo" ? "active":""}
          onClick={() => { setCategory("duo"); setForm(f=>({...f,service_id:""})); }}
        >
          Parejas
        </button>
      </div>

      {/* ─── lista píldoras ─── */}
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

      {/* ─── formulario ─── */}
      <form className="gc-form" onSubmit={handleSubmit}>
        <div className="gc-form-group">
          <label>Tu nombre*</label>
          <input
            type="text"
            name="buyerName"
            value={form.buyerName}
            onChange={handleInput}
            required
          />
        </div>
        <div className="gc-form-group">
          <label>Tu e-mail*</label>
          <input
            type="email"
            name="buyerEmail"
            value={form.buyerEmail}
            onChange={handleInput}
            required
          />
        </div>
        <div className="gc-form-group">
          <label>Nombre destinatario (opcional)</label>
          <input
            type="text"
            name="recipientName"
            value={form.recipientName}
            onChange={handleInput}
          />
        </div>
        <div className="gc-form-group">
          <label>E-mail destinatario (opcional)</label>
          <input
            type="email"
            name="recipientEmail"
            value={form.recipientEmail}
            onChange={handleInput}
          />
        </div>

        {/* radio Sí/No */}
        <fieldset className="gc-form-group">
          <legend>¿Quieres que Mizu envíe la tarjeta?</legend>
          <label>
            <input
              type="radio"
              name="sendByMizu"
              value="yes"
              checked={form.sendByMizu==="yes"}
              onChange={handleInput}
            /> Sí
          </label>{" "}
          <label>
            <input
              type="radio"
              name="sendByMizu"
              value="no"
              checked={form.sendByMizu==="no"}
              onChange={handleInput}
            /> No, la envío yo
          </label>
        </fieldset>

        <button className="gc-btn">Solicitar por WhatsApp</button>
      </form>

      {/* ─── FAQ ─── */}
      <h3 className="gc-faq-title">Preguntas frecuentes</h3>
      <ul className="gc-faq">
        <li><strong>¿Mi Gift-Card caduca?</strong> No, nunca caduca hasta que se redima.</li>
        <li><strong>¿Es transferible?</strong> Sí, puedes cederla si la persona original no puede asistir.</li>
        <li><strong>¿Cómo se canjea?</strong> Escríbenos por WhatsApp para elegir fecha.</li>
        <li><strong>¿Se entrega físicamente?</strong> No, enviamos un PDF digital.</li>
        <li><strong>¿Cómo se paga?</strong> De momento solo por transferencia bancaria (datos en WhatsApp).</li>
        <li><strong>¿Cuántas tarjetas puedo comprar?</strong> ¡Ilimitadas!</li>
      </ul>
    </section>
  );
}


// // ──────────────────────────────────────────────────────────────
// // src/pages/GiftCardPurchase.jsx
// // ──────────────────────────────────────────────────────────────
// import React, { useEffect, useState, useContext } from "react";
// import { Context } from "../store/appContext";          //  ← tu Flux
// import "../../styles/giftcard.css";

// export function GiftCardPurchase() {
//   const { store, actions } = useContext(Context);

//   /* 1 . Descarga servicios una sola vez */
//   useEffect(() => { actions.fetchServices(); }, []);

//   /* 2 . UI state */
//   const [category, setCategory] = useState("individual");   // pestaña activa
//   const [form, setForm] = useState({
//     giver_email:    "",
//     receiver_email: "",
//     service_id:     ""
//   });
//   const [error, setError] = useState("");

//   /* 3 . Lista filtrada por pestaña */
//   const visibles =
//     category === "individual" ? store.servicesIndividuales : store.servicesDuos;

//   /* cuando cambia la lista auto-selecciona el 1.º si no hay ninguno */
//   useEffect(() => {
//     if (visibles.length && !form.service_id) {
//       setForm(f => ({ ...f, service_id: visibles[0].id }));
//     }
//   }, [visibles]);

//   /* ───── helpers ───── */
//   const handleInput = e =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const selectService = id =>
//     setForm({ ...form, service_id: id });

//   /* 4 . Submit → redirige directo al enlace de Stripe */
//   const handleSubmit = e => {
//     e.preventDefault();
//     const chosen = store.services.find(s => s.id === form.service_id);

//     if (!chosen?.giftcard_url) {            // ⚠️ usamos giftcard_url
//       setError("No se encontró enlace de pago para ese servicio.");
//       return;
//     }

//     /* ➜ Opcionalmente envía los e-mails al backend aquí … */

//     window.location.href = chosen.giftcard_url;   // ← Stripe Checkout
//   };

//   return (
//     <section className="gc-section">

//       <h1 className="gc-title">Regala bienestar con Mizu</h1>
//       {error && <p className="gc-error">{error}</p>}

//       {/* ── pestañas ─────────────────── */}
//       <div className="gc-tabs">
//         <button
//           className={category === "individual" ? "active" : ""}
//           onClick={() => { setCategory("individual"); setForm(f=>({...f,service_id:""})); }}
//         >
//           Individuales
//         </button>
//         <button
//           className={category === "duo" ? "active" : ""}
//           onClick={() => { setCategory("duo"); setForm(f=>({...f,service_id:""})); }}
//         >
//           Parejas
//         </button>
//       </div>

//       {/* ── lista tipo “pill” ─────────── */}
//       <div className="gc-pill-list">
//         {visibles.map(s => (
//           <label key={s.id} className="gc-pill-wrapper">
//             <input
//               type="radio"
//               name="service_id"
//               value={s.id}
//               checked={form.service_id === s.id}
//               onChange={() => selectService(s.id)}
//             />
//             <span className="gc-pill">
//               <span className="gc-pill-title">{s.title}</span>
//               <span className="gc-pill-price">€{s.cost.toFixed(2)}</span>
//             </span>
//           </label>
//         ))}
//       </div>

//       {/* ── formulario ───────────────── */}
//       <form className="gc-form" onSubmit={handleSubmit}>
//         <div className="gc-form-group">
//           <label>Tu e-mail*</label>
//           <input
//             type="email"
//             name="giver_email"
//             value={form.giver_email}
//             onChange={handleInput}
//             required
//           />
//         </div>

//         <div className="gc-form-group">
//           <label>E-mail del destinatario (opcional)</label>
//           <input
//             type="email"
//             name="receiver_email"
//             value={form.receiver_email}
//             onChange={handleInput}
//           />
//         </div>

//         <button className="gc-btn">Ir a pago seguro</button>
//       </form>
//     </section>
//   );
// }
