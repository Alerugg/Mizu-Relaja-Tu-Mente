import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/app.css";
import logomizu from "../../img/logosolo.png";

export const Navbar = () => {
  const { pathname } = useLocation();          // sabemos dónde estamos
  const navigate     = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // colapso móvil

  const toggle = () => setIsOpen(!isOpen);
  const close  = () => setIsOpen(false);

  // --------  ¿estamos en Home?  --------
  const atHome = pathname === "/";

  return (
    <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
     <div className="container-fluid d-flex align-items-center
+                 justify-content-between flex-wrap">

        {/* ----------  LOGO  ---------- */}
        <Link className="navbar-brand" to="/" onClick={close}>
          <img
            src={logomizu}
            alt="Mizu Logo"
            className="navbar-logo-img"
          />
        </Link>

        {/* ----------  TOGGLER  ---------- */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggle}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* ----------  LINKS  ---------- */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          <div className="navbar-nav mx-auto">

            {/* Siempre visible */}
            <Link className="nav-link" onClick={close} to="/">
              Inicio
            </Link>

            {atHome && (
              <>
                <a className="nav-link" href="#services" onClick={close}>
                  Servicios
                </a>
                <a className="nav-link" href="#conocenos" onClick={close}>
                  Conócenos
                </a>
                <a className="nav-link" href="#contact" onClick={close}>
                  Contacto
                </a>
              </>
            )}

            {/* NUEVO: Regala MIZU (gift card) */}
            <button
              className="nav-link btn btn-link p-0"
              onClick={() => {
                close();
                navigate("/gift-card");
              }}
              style={{ textDecoration: "none" }}
            >
              Regala&nbsp;MIZU
            </button>
          </div>

          {/* ----------  WHATSAPP  ---------- */}
          <div className="navbar-whatsapp-mobile">
            <a
              href="https://wa.me/34691352596"
              className="navbar-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
            >
              <i className="fab fa-whatsapp" />
              &nbsp; Escríbenos
            </a>
          </div>
        </div>

        {/* WhatsApp desktop */}        
        <div className="d-none d-lg-flex ms-auto">
          <a
            href="https://wa.me/34691352596"
            className="navbar-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-whatsapp" />
            &nbsp; Escríbenos
          </a>
        </div>
      </div>
    </nav>
  );
};
