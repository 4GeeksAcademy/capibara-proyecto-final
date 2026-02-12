import React from "react";
import { Link } from "react-router-dom";

export const Shoes = () => {
  // Example store location (latitude, longitude)
  const storeLat = 40.7128; // New York latitude
  const storeLng = -74.0060; // New York longitude

  // Random radius in meters (between 500m and 2000m)
  const radius = Math.floor(Math.random() * (2000 - 500 + 1)) + 500;

  // Google Maps iframe URL
  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${storeLat},${storeLng}&zoom=14&maptype=roadmap`;

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="display-4 fw-bold text-center mb-4">Sobre Nosotros</h1>
          <p className="lead text-muted text-center mb-5">
            Somos ShoeStore, tu destino principal para calzado de alta calidad.
          </p>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="card-title fw-semibold mb-3">Nuestra Misión</h2>
              <p className="card-text">
                En <strong>ShoeStore</strong>, creemos que el calzado es más que solo protección; es una declaración de estilo y comodidad. Nuestra misión es proporcionar una selección curada de zapatos que fusionen la moda contemporánea con una calidad inigualable, asegurando que cada paso que des sea con confianza.
              </p>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="card-title fw-semibold mb-3">Nuestra Historia</h2>
              <p className="card-text">
                Fundada en 2026, ShoeStore comenzó como una pequeña tienda en línea con la visión de simplificar la compra de zapatos de calidad. Hoy, somos un minorista en crecimiento que se enorgullece de asociarse con marcas reconocidas para ofrecerte lo mejor del mercado.
              </p>
            </div>
          </div>

          <div className="text-center mt-5">
            <h3 className="mb-3">Explora Nuestro Catálogo</h3>
            <Link to="/catalog" className="btn btn-dark btn-lg">
              Comprar Ahora
            </Link>
          </div>

          <div className="mt-5">
            <h3 className="mb-3 text-center">Nuestra Ubicación</h3>
            <div className="map-container text-center">
              <iframe
                title="ShoeStore Location"
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={mapUrl}
              ></iframe>
              <p className="mt-2 text-muted">
                Radio aproximado de visibilidad: {radius} metros
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
