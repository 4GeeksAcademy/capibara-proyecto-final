import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Single = () => {
    const { store, dispatch } = useGlobalReducer();
    const { theId } = useParams();
    const [size, setSize] = useState(""); // Estado local para la talla seleccionada

    // Buscamos el zapato por ID
    const product = store.shoes.find(item => item.id == theId);


    const handleAddToCart = () => {
        if (!size) {
            alert("Por favor selecciona una talla");
            return;
        }
        // Enviamos el producto junto con la talla seleccionada
        dispatch({
            type: "add_to_cart",
            payload: { ...product, selectedSize: size }
        });
        alert("Producto agregado");
    };

    return (
        <div className="container mt-5 mb-5">
            {product ? (
                <div className="row">
                    {/* Columna Izquierda: Imagen */}
                    <div className="col-md-6 mb-4">
                        <img
                            src={product.image_url}  // <--- CORREGIDO: image_url
                            className="img-fluid rounded shadow"
                            alt={product.name}
                            style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
                        />
                    </div>

                    {/* Columna Derecha: Información */}
                    <div className="col-md-6">
                        <h1 className="display-4 fw-bold">{product.name}</h1>
                        <h3 className="text-primary my-3 display-6">${product.price}</h3>

                        <p className="lead text-muted">
                            {product.description || "Este producto no tiene descripción detallada."}
                        </p>

                        {/* Selector de Talla */}
                        <div className="mb-4">
                            <label className="form-label fw-bold">Selecciona tu talla:</label>
                            <select
                                className="form-select w-50"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                            >
                                <option value="">Elegir...</option>
                                <option value="38">38 EU</option>
                                <option value="39">39 EU</option>
                                <option value="40">40 EU</option>
                                <option value="41">41 EU</option>
                                <option value="42">42 EU</option>
                            </select>
                        </div>

                        <hr className="my-4" />

                        <div className="d-flex gap-3">
                            <button
                                className="btn btn-dark btn-lg flex-grow-1"
                                onClick={handleAddToCart}
                            >
                                <i className="fa-solid fa-cart-plus"></i> Agregar al Carrito
                            </button>

                            <Link to="/catalog">
                                <span className="btn btn-outline-secondary btn-lg" role="button">
                                    Volver
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center mt-5">
                    <h3>Producto no encontrado</h3>
                    <Link to="/catalog">
                        <button className="btn btn-primary">Volver al catálogo</button>
                    </Link>
                </div>
            )}
        </div>
    );
};