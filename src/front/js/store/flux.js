// src/store/flux.js
const getState = ({ getStore, getActions, setStore }) => {

    /*  Enlaces Stripe por título  */
    const stripeLinks = {
      "Oasis Capilar":           "https://buy.stripe.com/00gbMOfIycjK3WE5kk",
      "Inmersion Mizu":          "https://buy.stripe.com/28odUWaoecjKgJq289",
      "Efecto Mizu":             "https://buy.stripe.com/7sI046eEuabCbp68wy",
      "Experiencia Mizu Mujer":  "https://buy.stripe.com/cN2bMO67YcjKdxefZ3",
      "Experiencia Premium":     "https://buy.stripe.com/4gw9EG3ZQ6ZqeBi9AD",
      "Experiencia Mizu Hombre": "https://buy.stripe.com/3cs7wybsi83u1Ow4gk"
    };
  
    return {
      store: {
        services:             [],
        servicesIndividuales: [],
        servicesDuos:         []
      },
  
      actions: {
        /* ----------------------  DESCARGA SERVICIOS  ---------------------- */
        fetchServices: async () => {
          try {
            const url = `${process.env.BACKEND_URL}/api/services`;
  
            /*  👉  quitamos la cabecera Cookie que provocaba el error  */
            const response = await fetch(url, { method: "GET", mode: "cors" });
            if (!response.ok) throw new Error("Error al obtener los servicios");
  
            const raw = await response.json();
  
            /* añade enlace Stripe y separa por categoría */
            const withLinks = raw.map(s => ({
              ...s,
              stripe_url: stripeLinks[s.title] || null
            }));
  
            const servicesIndividuales = withLinks.filter(s => s.service_type === "individual");
            const servicesDuos         = withLinks.filter(s => s.service_type === "duo");
  
            setStore({
              services: withLinks,
              servicesIndividuales,
              servicesDuos
            });
          } catch (error) {
            console.error("Error fetching services:", error);
          }
        }
      }
    };
  };
  
  export default getState;
  