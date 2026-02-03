import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ProductCard } from "../components/ProductCard";

export const Catalog = () => {
  const { store } = useGlobalReducer();

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h2 className="display-5 fw-bold">Nuestra Colección</h2>
          <p className="lead text-muted">Encuentra el par perfecto para ti</p>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="row g-4">
        {store.products && store.products.length > 0 ? (
          store.products.map((product) => (
            <div key={product.id} className="col-12 col-md-6 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <div className="alert alert-info">
              No hay productos disponibles en este momento.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};