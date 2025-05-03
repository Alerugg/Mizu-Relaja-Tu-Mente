import React from "react";



const ServiceListCard = ({ service, reverse=false, onClick }) => (
    <article className={`svc-list ${reverse ? "reverse":""}`} onClick={onClick}>
      <div className="svc-list__img">
        <img src={service.image} alt={service.title}/>
      </div>
      <div className="svc-list__body">
        <h2>{service.title}</h2>
        <h3>{service.subtitle}</h3>
        <p>{service.description}</p>
        <button>Ver Servicio</button>
      </div>
    </article>
  );
  export default ServiceListCard;
  