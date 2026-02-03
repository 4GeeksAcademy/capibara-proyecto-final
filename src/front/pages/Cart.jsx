import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { CartItem } from "../components/CartItem";
import { Link } from "react-router-dom";

export const Cart = () => {
    const { store } = useGlobalReducer();

    // Calculamos el total de la compra
    const total = store.cart.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Tu Carrito de Compras</h2>
            
            <div className="row">
                <div className="col-md-8">
                    {store.cart.length > 0 ? (
                        store.cart.map((item, index) => (
                            <CartItem key={`${item.id}-${index}`} item={item} />
                        ))
                    ) : (
                        <div className="alert alert-info">
                            Tu carrito está vacío. <Link to="/catalog">¡Ve a buscar unos zapatos!</Link>
                        </div>
                    )}
                </div>

                {/* Resumen de Compra */}
                {store.cart.length > 0 && (
                    <div className="col-md-4">
                        <div className="card p-3 shadow-sm border-dark">
                            <h4>Resumen</h4>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <span>Productos:</span>
                                <span>{store.cart.length}</span>
                            </div>
                            <div className="d-flex justify-content-between mt-2 h5">
                                <strong>Total:</strong>
                                <strong>${total.toFixed(2)}</strong>
                            </div>
                            <Link to="/checkout">
                                <button className="btn btn-dark w-100 mt-3 btn-lg">
                                 Proceder al Pago
                                 </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};