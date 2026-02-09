import React from "react";
import { Link } from "react-router-dom";

export const Shoes = () => {
  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="display-4 fw-bold text-center mb-4">
            Sobre Nosotros
          </h1>
          <p className="lead text-muted text-center mb-5">
            Somos ShoeStore, tu destino principal para calzado de alta calidad.
          </p>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="card-title fw-semibold mb-3">Nuestra Misión</h2>
              <p className="card-text">
                En **ShoeStore**, creemos que el calzado es más que solo protección; es una declaración de estilo y comodidad. Nuestra misión es proporcionar una selección curada de zapatos que fusionen la moda contemporánea con una calidad inigualable, asegurando que cada paso que des sea con confianza.
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
        </div>
      </div>
    </div>
  );
};
