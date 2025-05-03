import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";


// Páginas
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Individuales } from "./pages/individuales";
import { Parejas } from "./pages/parejas";
import { Servicio } from "./pages/servicio";
import { Single } from "./pages/single";
import { PrivacyPolicy } from "./pages/privacyPolicy";
import {GiftCardPurchase} from "./pages/GiftCardPurchase";
import {GiftCardRedeem} from "./pages/GiftCardRedeem";

// Componentes globales
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";


// Context
import injectContext from "./store/appContext";
import '@fortawesome/fontawesome-free/css/all.min.css';



// ✅ Importación del CSS global para estilos base y variables (nueva línea)
import "../styles/app.css"; // Asegúrate de que el archivo exista en src/styles/

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "")
        return <BackendURL />;

    return (
        <div className="App"> {/* Clase usada por app.css */}
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Individuales />} path="/individuales" />
                        <Route element={<PrivacyPolicy />} path="/privacy" />
                        <Route element={<Parejas />} path="/parejas" />
                        <Route element={<Servicio />} path="/servicio/:id" />
                        <Route element={<GiftCardPurchase />} path="/gift-card" />
                        <Route element={<GiftCardRedeem />} path="/contact" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
