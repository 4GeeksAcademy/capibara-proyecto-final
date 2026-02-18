// src/front/pages/Shoe.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Shoe = () => {
    const { store, dispatch } = useGlobalReducer();
    const { theId } = useParams();
    const [selectedSize, setSelectedSize] = useState("");
    const [shoe, setShoe] = useState("");

    // Notification state
    const [msg, setMsg] = useState({ show: false, text: "", type: "" });

    const notify = (text, type = "dark") => {
        setMsg({ show: true, text, type });
        setTimeout(() => setMsg({ show: false, text: "", type: "" }), 3000);
    };
    useEffect(() => {
        fetch(`/api/shoe/${theId}`)
            .then(res => res.json())
            .then(data => {
                if (data.msg) {
                    notify("⚠️ Producto no encontrado", "warning");
                } else {
                    setShoe(data);
                }
            })
            .catch(() => notify("❌ Error al cargar el producto", "danger"));
    }, [theId]);


    // 1️⃣ Loading state
    if (shoe) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2">Cargando productos...</p>
            </div>
        );
    }

    // 2️⃣ Shoe not found
    if (!shoe) {
        return (
            <div className="text-center mt-5">
                <h3>Producto no encontrado</h3>
                <Link to="/catalog" className="btn btn-primary mt-3">Volver al catálogo</Link>
            </div>
        );
    }

    // Compute unavailable sizes from stock
    const unavailableSizes = shoe.sizes?.filter(size => !shoe.stock || shoe.stock[size] === 0) || [];

    // Add to cart handler
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
            {/* Notification */}
            {msg.show && (
                <div className={`alert alert-${msg.type} shadow position-fixed top-0 end-0 m-4`} 
                     style={{ zIndex: 9999 }}>
                    {msg.text}
                </div>
            )}

            <div className="row">
                {/* Left: Shoe image */}
                <div className="col-md-6 mb-4">
                    <img
                        src={shoe.img_url}
                        className="img-fluid rounded shadow"
                        alt={shoe.model_name}
                        style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
                    />
                </div>

                {/* Right: Shoe details */}
                <div className="col-md-6">
                    <h1 className="display-4 fw-bold">{shoe.model_name}</h1>
                    <h3 className="text-primary my-3 display-6">${shoe.price}</h3>
                    <p className="lead text-muted">
                        {shoe.description || "Este producto no tiene descripción detallada."}
                    </p>

                    {/* Sizes Selector */}
                    {shoe.sizes?.length > 0 && (
                        <div className="mb-4">
                            <label className="form-label fw-bold">Selecciona tu talla:</label>
                            <div className="d-flex gap-2 flex-wrap">
                                {shoe.sizes.map(size => {
                                    const isAvailable = !unavailableSizes.includes(size);
                                    return (
                                        <button
                                            key={size}
                                            className={`btn ${selectedSize === size
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

                    {/* Add to cart & back buttons */}
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
