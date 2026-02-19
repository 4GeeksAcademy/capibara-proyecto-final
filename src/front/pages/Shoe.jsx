import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Shoe = () => {
  const { store, dispatch } = useGlobalReducer();
  const { theId } = useParams();

  const [selectedSize, setSelectedSize] = useState("");
  const [shoe, setShoe] = useState(null);        // ✅ null = not loaded yet
  const [loading, setLoading] = useState(true);  // ✅ real loading state

  // Toast state
  const [toast, setToast] = useState({ show: false, text: "", type: "dark" });
  const toastTimerRef = useRef(null);

  const notify = (text, type = "dark") => {
    setToast({ show: true, text, type });

    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast({ show: false, text: "", type: "dark" });
    }, 2500);
  };

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(`/api/shoe/${theId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;

        if (data?.msg) {
          setShoe(null);
          notify("⚠️ Producto no encontrado", "warning");
        } else {
          setShoe(data);
        }
      })
      .catch(() => {
        if (!active) return;
        notify("❌ Error al cargar el producto", "danger");
        setShoe(null);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [theId]);

  // ✅ Loading state (fixed)
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Cargando producto...</p>
      </div>
    );
  }

  // ✅ Not found state (fixed)
  if (!shoe) {
    return (
      <div className="text-center mt-5">
        <h3>Producto no encontrado</h3>
        <Link to="/catalog" className="btn btn-primary mt-3">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const unavailableSizes =
    shoe.sizes?.filter((size) => !shoe.stock || shoe.stock[size] === 0) || [];

  const handleAddToCart = () => {
    if (shoe.sizes?.length > 0 && !selectedSize) {
      notify("⚠️ Por favor selecciona una talla", "warning");
      return;
    }

    dispatch({
      type: "add_to_cart",
      payload: selectedSize ? { ...shoe, selectedSize } : shoe,
    });

    notify(`✅ ${shoe.model_name} agregado al carrito!`, "success");
  };

  return (
    <div className="container mt-5 mb-5 position-relative">
      {/* ✅ Ecommerce-style Toast (bottom-right) */}
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

      <div className="row">
        {/* Left */}
        <div className="col-md-6 mb-4">
          <img
            src={shoe.img_url}
            className="img-fluid rounded shadow"
            alt={shoe.model_name}
            style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
          />
        </div>

        {/* Right */}
        <div className="col-md-6">
          <h1 className="display-4 fw-bold">{shoe.model_name}</h1>
          <h3 className="text-primary my-3 display-6">${shoe.price}</h3>
          <p className="lead text-muted">
            {shoe.description || "Este producto no tiene descripción detallada."}
          </p>

          {shoe.sizes?.length > 0 && (
            <div className="mb-4">
              <label className="form-label fw-bold">Selecciona tu talla:</label>
              <div className="d-flex gap-2 flex-wrap">
                {shoe.sizes.map((size) => {
                  const isAvailable = !unavailableSizes.includes(size);
                  return (
                    <button
                      key={size}
                      className={`btn ${
                        selectedSize === size
                          ? "btn-dark"
                          : isAvailable
                          ? "btn-outline-dark"
                          : "btn-outline-secondary"
                      }`}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(size)}
                      style={!isAvailable ? { textDecoration: "line-through" } : {}}
                    >
                      {size} EU
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="d-flex gap-3 mt-4">
            <button className="btn btn-dark btn-lg flex-grow-1" onClick={handleAddToCart}>
              <i className="fa-solid fa-cart-plus me-2"></i> Agregar al Carrito
            </button>

            <Link to="/catalog" className="btn btn-outline-secondary btn-lg">
              Volver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
