import React from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ProductCard = ({ product }) => {
  const { dispatch } = useGlobalReducer();

  const addToCart = () => {
    dispatch({
      type: "add_to_cart",
      payload: product,
    });
    alert(`${product.name} agregado al carrito!`);
  };

  return (
    <div className="card h-100 shadow-sm border-0">
      <img
        src={product.image_url}
        className="card-img-top"
        alt={product.name}
        style={{ height: "250px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted flex-grow-1">
          {product.description || "Descripción breve del zapato."}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="h5 mb-0 text-primary">${product.price}</span>
          <div>
            {/* Updated route to point to /shoe/:id */}
            <Link to={`/shoe/${product.id}`} className="btn btn-outline-secondary btn-sm me-2">
              Ver más
            </Link>
            <button className="btn btn-dark btn-sm" onClick={addToCart}>
              <i className="fa-solid fa-cart-plus"></i> Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
