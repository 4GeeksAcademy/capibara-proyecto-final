import React, { useEffect, useRef, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ProductCard } from "../components/ProductCard";
import { Link } from "react-router-dom";

export const Catalog = () => {
  const { store, dispatch } = useGlobalReducer();

  // ✅ toast state
  const [toast, setToast] = useState({ show: false, text: "", type: "dark" });
  const toastTimerRef = useRef(null);

  const notify = (text, type = "dark") => {
    setToast({ show: true, text, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast({ show: false, text: "", type: "dark" });
    }, 2500);
  };

  const loadShoes = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");

      const response = await fetch(backendUrl + "/api/shoes");
      if (!response.ok) throw new Error("Error loading shoes");

      const data = await response.json();
      dispatch({ type: "load_products", payload: data });
    } catch (error) {
      console.error("Error loading products:", error);
      notify("❌ Error al cargar el catálogo", "danger");
    }
  };

  useEffect(() => {
    if (!store.products || store.products.length === 0) loadShoes();
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ add-to-cart handler for catalog cards
  const handleQuickAdd = (product) => {
    dispatch({ type: "add_to_cart", payload: product });
    notify(`✅ ${product.model_name} agregado al carrito!`, "success");
  };

  return (
    <div className="container mt-5">
      {/* ✅ Ecommerce-style toast */}
      <div
        className={`toast align-items-center text-bg-${toast.type} ${toast.show ? "show" : ""}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9999,
          minWidth: 280,
          boxShadow: "0 10px 25px rgba(0,0,0,.25)",
        }}
      >
        <div className="d-flex">
          <div className="toast-body">{toast.text}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            onClick={() => setToast({ show: false, text: "", type: "dark" })}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Nuestra Colección</h1>
        <Link to="/" className="btn btn-sm btn-outline-secondary">
          <i className="fa-solid fa-house me-2"></i>Inicio
        </Link>
      </div>

      {store.products && store.products.length > 0 ? (
        <div className="row g-4">
          {store.products.map((shoe) => (
            <div key={shoe.id} className="col-12 col-md-6 col-lg-3">
              {/* ✅ pass callback into ProductCard */}
              <ProductCard product={shoe} onAdd={() => handleQuickAdd(shoe)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Buscando los mejores zapatos para ti...</p>
        </div>
      )}
    </div>
  );
};
