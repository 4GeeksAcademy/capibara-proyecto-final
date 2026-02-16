import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

export const Cart = () => {
    const { store, dispatch } = useGlobalReducer();

    // Calculamos el total con 2 decimales para evitar errores de redondeo de JS
    const total = store.cart.reduce((acumulador, item) => acumulador + item.price, 0).toFixed(2);

    return (
        <div className="container mt-5 mb-5" style={{ minHeight: "70vh" }}>
            <h2 className="mb-4 fw-bold">🛒 Mi Carrito</h2>

            {store.cart.length === 0 ? (
                <div className="text-center p-5 bg-light rounded shadow-sm border">
                    <i className="fa-solid fa-cart-shopping fa-3x mb-3 text-muted"></i>
                    <h3>Tu carrito está vacío</h3>
                    <p className="text-muted">¡Parece que aún no has elegido tus nuevos zapatos favoritos!</p>
                    <Link to="/catalog">
                        <button className="btn btn-primary btn-lg mt-3 px-5">Explorar Catálogo</button>
                    </Link>
                </div>
            ) : (
                <div className="row g-4">
                    {/* Lista de items */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm">
                            <ul className="list-group list-group-flush">
                                {store.cart.map((item, index) => (
                                    <li key={index} className="list-group-item p-3">
                                        <div className="row align-items-center">
                                            <div className="col-3 col-md-2">
                                                <img 
                                                    src={item.image_url} 
                                                    alt={item.name}
                                                    className="img-fluid rounded"
                                                    style={{ objectFit: "cover", aspectRatio: "1/1" }}
                                                />
                                            </div>
                                            <div className="col-5 col-md-6">
                                                <h6 className="mb-0 fw-bold">{item.name}</h6>
                                                <small className="text-secondary">Talla seleccionada: {item.selectedSize || "N/A"}</small>
                                            </div>
                                            <div className="col-4 col-md-4 text-end">
                                                <span className="fw-bold d-block mb-1">${item.price.toFixed(2)}</span>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger border-0"
                                                    title="Eliminar del carrito"
                                                    onClick={() => dispatch({ type: "remove_from_cart", payload: index })} // Usamos index
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Resumen de pago */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 sticky-top" style={{ top: "20px" }}>
                            <div className="card-body p-4">
                                <h5 className="mb-4 fw-bold">Resumen del pedido</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Subtotal</span>
                                    <span>${total}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Envío</span>
                                    <span className="text-success fw-bold">Gratis</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="h5 fw-bold">Total</span>
                                    <span className="h4 fw-bold text-primary">${total}</span>
                                </div>
                                <Link to="/checkout" className="btn btn-dark btn-lg w-100 mb-3">
                                    Finalizar Compra
                                </Link>
                                <Link to="/catalog" className="btn btn-link w-100 text-muted text-decoration-none text-center">
                                    <i className="fa-solid fa-arrow-left me-2"></i>Seguir comprando
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};