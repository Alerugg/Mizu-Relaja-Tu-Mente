import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import fallbackImg from "../../img/test3.png";
import "../../styles/servicio.css";

/* util – convierte string con “•”, saltos de línea o puntos en array → <ul><li> */
const toArr = txt =>
  (txt || "")
    .replace(/•/g, "")
    .split(/[\n.]/)
    .map(t => t.trim())
    .filter(Boolean);

export const Servicio = () => {
  const { id }       = useParams();
  const { store, actions } = useContext(Context);
  const [srv, setSrv] = useState(null);

  /* 1. trae servicios si aún no existen */
  useEffect(() => {
    if (store.services.length === 0) actions.fetchServices();
  }, []);

  /* 2. selecciona el servicio concreto */
  useEffect(() => {
    if (store.services.length) {
      setSrv(store.services.find(s => s.id === +id));
    }
  }, [store.services, id]);

  if (!srv) return <p className="svcLoading">Cargando…</p>;

  return (
    <section className="svcDetail">
      <article className="svcCard">
        {/* ---------- cabecera ---------- */}
        <header className="svcHead">
          <img
            src={srv.image || fallbackImg}
            alt={srv.title}
            className="svcImg"
          />

          <div className="svcBasics">
            <h1 className="svcTitle">{srv.title}</h1>

            <p className="svcPrice">
              <strong>Precio:</strong> {srv.cost} €
            </p>

            {srv.duration && (
              <p>
                <strong>Duración:</strong> {srv.duration}
              </p>
            )}

            {srv.location && (
              <p>
                <strong>Ubicación:</strong> {srv.location}
              </p>
            )}
          </div>
        </header>

        {/* ---------- descripción ---------- */}
        {srv.description && (
          <>
            <h3 className="svcSection">Descripción</h3>
            <p className="svcDescription">{srv.description}</p>
          </>
        )}

        {/* ---------- detalle en 3 columnas ---------- */}
        <div className="svcCols">
          <div>
            <h3 className="svcSection">¿Qué incluye?</h3>
            <ul>{toArr(srv.includes).map((t, i) => <li key={i}>{t}</li>)}</ul>
          </div>

          <div>
            <h3 className="svcSection">Beneficios</h3>
            <ul>{toArr(srv.benefits).map((t, i) => <li key={i}>{t}</li>)}</ul>
          </div>

          <div>
            <h3 className="svcSection">Notas importantes</h3>
            <ul>{toArr(srv.important_notes).map((t, i) => <li key={i}>{t}</li>)}</ul>
          </div>
        </div>

        {/* ---------- CTA ---------- */}
        <button
          className="svcBtn"
          onClick={() =>
            srv.booking_url &&
            window.open(srv.booking_url, "_blank", "noopener,noreferrer")
          }
          disabled={!srv.booking_url}
        >
          {srv.booking_url ? "Reservar ahora" : "Reserva no disponible"}
        </button>
      </article>
    </section>
  );
};
