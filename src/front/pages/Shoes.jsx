import React from "react";
import { Link } from "react-router-dom";

export const Shoes = () => {
    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">Sobre Nosotros</h1>
                <Link to="/" className="btn btn-sm btn-outline-secondary">
                    <i className="fa-solid fa-house me-2"></i>Inicio
                </Link>
            </div>
            <p className="lead">
                Somos una tienda de zapatos apasionada por ofrecer la mejor calidad y estilo a nuestros clientes. 
                Con años de experiencia en la industria, nos dedicamos a seleccionar cuidadosamente cada par de zapatos para garantizar que cumplan con los más altos estándares.
            </p>
            <p>
                Nuestra misión es proporcionar una experiencia de compra excepcional, combinando productos de alta calidad con un servicio al cliente amigable y eficiente. 
                Creemos que cada persona merece encontrar el par perfecto que se adapte a su estilo y necesidades.
            </p>
            <p>
                Gracias por elegirnos como tu tienda de zapatos de confianza. Estamos comprometidos a ayudarte a encontrar el calzado ideal para cada ocasión.
            </p>
        </div>
    );
};
