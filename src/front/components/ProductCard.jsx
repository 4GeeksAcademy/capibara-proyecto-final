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
    alert(`${product.model_name} agregado al carrito!`);
  };

  return (
    <div className="card h-100 shadow-sm border-0">
      <img
        src={product.img_url || "https://via.placeholder.com/300"}
        className="card-img-top"
        alt={product.model_name}
        style={{ height: "250px", objectFit: "cover" }}
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">
          {product.brand}
        </h5>

        <p className="card-text text-muted flex-grow-1">
          {product.model_name}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="h5 mb-0 text-primary">
            ${parseFloat(product.price).toFixed(2)}
          </span>

          <div>
            
              
            
              
            

            <button
              className="btn btn-dark btn-sm"
              onClick={addToCart}
            >
              <i className="fa-solid fa-cart-plus"></i> Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

