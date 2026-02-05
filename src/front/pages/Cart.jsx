import React from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Cart = () => {
    const { store, dispatch } = useGlobalReducer();

    // Calculamos el total
    const total = store.cart.reduce((acumulador, item) => acumulador + item.price, 0);

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4">🛒 Tu Carrito de Compras</h2>

            {store.cart.length === 0 ? (
                <div className="text-center p-5 bg-light rounded shadow-sm">
                    <h3>Tu carrito está vacío</h3>
                    <p className="text-muted">Parece que aún no has añadido zapatos.</p>
                    <Link to="/catalog">
                        <button className="btn btn-primary mt-3">Ir a comprar</button>
                    </Link>
                </div>
            ) : (
                <div className="row">
                    {/* Lista de items  */}
                    <div className="col-md-8">
                        <ul className="list-group mb-3 shadow-sm">
                            {store.cart.map((item, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between lh-sm align-items-center">
                                    <div className="d-flex align-items-center">
                                        <img 
                                            src={item.image_url} 
                                            alt={item.name}
                                            style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "15px" }} 
                                            className="rounded"
                                        />
                                        <div>
                                            <h6 className="my-0">{item.name}</h6>
                                            <small className="text-muted">Talla: {item.selectedSize || "N/A"}</small>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="text-muted me-3 fw-bold">${item.price}</span>
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

                    {/* Resumen de pago */}
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 bg-light">
                            <div className="card-body p-4">
                                <h4 className="mb-3">Resumen</h4>
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
                                <Link to="/checkout">
                                    <button className="btn btn-success w-100 py-2 fw-bold">
                                        Proceder al Pago
                                    </button>
                                </Link>
                                <Link to="/catalog" className="d-block text-center mt-3 text-decoration-none">
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