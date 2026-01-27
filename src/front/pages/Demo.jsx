import React from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Demo = () => {
    const { store, dispatch } = useGlobalReducer();

    // Calculamos el precio total sumando el precio de cada item en el carrito
    // reduce es una función de JS perfecta para "acumular" valores
    const total = store.cart.reduce((acumulador, item) => acumulador + item.price, 0);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">🛒 Tu Carrito de Compras</h2>

            {/* Verificamos si el carrito está vacío */}
            {store.cart.length === 0 ? (
                <div className="text-center p-5 bg-light rounded">
                    <h3>Tu carrito está vacío</h3>
                    <p className="text-muted">Parece que aún no has añadido zapatos.</p>
                    <Link to="/">
                        <button className="btn btn-primary mt-3">Volver a la tienda</button>
                    </Link>
                </div>
            ) : (
                <div className="row">
                    {/* Columna Izquierda: Lista de items */}
                    <div className="col-md-8">
                        <ul className="list-group mb-3">
                            {store.cart.map((item, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between lh-sm align-items-center">
                                    <div className="d-flex align-items-center">
                                        {/* Imagen pequeña del producto */}
                                        <img 
                                            src={item.image || "https://via.placeholder.com/50"} 
                                            alt={item.name}
                                            style={{ width: "60px", height: "60px", objectFit: "cover", marginRight: "15px" }} 
                                            className="rounded"
                                        />
                                        <div>
                                            <h6 className="my-0">{item.name}</h6>
                                            <small className="text-muted">Talla: 42 (Ejemplo)</small>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="text-muted me-3">${item.price}</span>
                                        {/* Botón para eliminar */}
                                        <button 
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => dispatch({ type: "remove_from_cart", payload: item })}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna Derecha: Resumen de pago */}
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header bg-primary text-white">
                                Resumen
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Subtotal:</span>
                                    <span>${total}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Envío:</span>
                                    <span className="text-success">Gratis</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <strong>Total:</strong>
                                    <strong className="text-primary fs-4">${total}</strong>
                                </div>
                                <button className="btn btn-success w-100 py-2">
                                    Pagar ahora
                                </button>
                                <Link to="/" className="d-block text-center mt-3 text-decoration-none">
                                    Seguir comprando
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};