// ----------------------------------------------------------
//  PAREJAS – Servicios en pareja
// ----------------------------------------------------------
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import placeholder from "../../img/test3.png";          // imagen de respaldo
import "../../styles/parejas.css";

export const Parejas = () => {
  const { store, actions } = useContext(Context);
  const navigate           = useNavigate();

  // ▸ Carga inicial (solo si aún no están en el store)
  useEffect(() => {
    if (store.servicesDuos.length === 0) actions.fetchServices();
  }, []);

  // Lista ya filtrada en el Flux
  const serviciosDuo = store.servicesDuos;

  const handleViewService = (id) => navigate(`/servicio/${id}`);

  return (
    <section className="parejas-section">
      <div className="parejas-overlay">
        <h1 className="parejas-title">Servicios en Pareja</h1>

        <div className="parejas-card-list">
          {serviciosDuo.length ? (
            serviciosDuo.map((svc, i) => (
              <div
                key={svc.id}
                className={`parejas-card-container ${i % 2 ? "reverse" : ""}`}
              >
                <div className="parejas-img-wrapper">
                  <img
                    src={svc.image_url || placeholder}
                    alt={svc.title}
                    className="parejas-img"
                  />
                </div>

                <div className="parejas-card-body">
                  <h2 className="parejas-card-title">{svc.title}</h2>
                  <h3 className="parejas-card-subtitle">{svc.subtitle}</h3>

                  {/*  Permite que backend envíe <ul><li>… */}
                  <div
                    className="parejas-card-description"
                    dangerouslySetInnerHTML={{ __html: svc.description }}
                  />

                  <button
                    className="parejas-card-btn"
                    onClick={() => handleViewService(svc.id)}
                  >
                    Ver servicio
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="parejas-empty-text">
              Cargando experiencias para dos…
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
