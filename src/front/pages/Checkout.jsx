import React, { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Checkout = () => {
    const { store, dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        card: ""
    });

    const total = store.cart.reduce((acc, item) => acc + item.price, 0);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar al backend
        console.log("Orden procesada", formData, store.cart);
        alert("¡Gracias por tu compra! Tu pedido ha sido procesado.");
        // Opcional: Limpiar carrito después de comprar
        // dispatch({ type: "clear_cart" }); (requeriría agregar esto al reducer)
    };

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4">Finalizar Compra</h2>
            <div className="row">
                {/* Columna Izquierda: Formulario */}
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 p-4 mb-4">
                        <h4 className="mb-3">Datos de Envío</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="name" 
                                    required 
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    name="email" 
                                    placeholder="nombre@ejemplo.com" 
                                    required 
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Dirección de Entrega</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="address" 
                                    placeholder="Calle 123..." 
                                    required 
                                    onChange={handleInputChange}
                                />
                            </div>

                            <hr className="my-4" />

                            <h4 className="mb-3">Método de Pago</h4>
                            <div className="mb-3">
                                <label className="form-label">Número de Tarjeta</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="card" 
                                    placeholder="0000 0000 0000 0000" 
                                    required 
                                    onChange={handleInputChange}
                                />
                            </div>
                            
                            <button type="submit" className="btn btn-success btn-lg w-100 mt-4">
                                Confirmar y Pagar ${total}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Columna Derecha: Resumen */}
                <div className="col-md-4">
                    <div className="card shadow-sm bg-light">
                        <div className="card-body">
                            <h5 className="card-title d-flex justify-content-between">
                                <span>Tu Pedido</span>
                                <span className="badge bg-primary rounded-pill">{store.cart.length}</span>
                            </h5>
                            <ul className="list-group list-group-flush mt-3">
                                {store.cart.map((item, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between bg-light lh-sm">
                                        <div>
                                            <h6 className="my-0">{item.name}</h6>
                                            <small className="text-muted">Talla: {item.selectedSize}</small>
                                        </div>
                                        <span className="text-muted">${item.price}</span>
                                    </li>
                                ))}
                                <li className="list-group-item d-flex justify-content-between bg-light fw-bold mt-2">
                                    <span>Total (USD)</span>
                                    <span>${total}</span>
                                </li>
                            </ul>
                            <Link to="/cart" className="btn btn-outline-secondary w-100 mt-3">
                                Volver al Carrito
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};