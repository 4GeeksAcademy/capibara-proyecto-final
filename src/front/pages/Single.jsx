import React from "react";
import { Link, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Single = () => {
    const { store, dispatch } = useGlobalReducer();
    const { theId } = useParams();

    // Buscamos el zapato específico usando el ID de la URL
    // Nota: Usamos '==' en lugar de '===' para que no importe si uno es string y el otro número
    const product = store.products.find(item => item.id == theId);

    return (
        <div className="container mt-5">
            {product ? (
                // SI ENCONTRAMOS EL PRODUCTO, MOSTRAMOS SU DETALLE
                <div className="row">
                    {/* Columna Izquierda: Imagen */}
                    <div className="col-md-6 mb-4">
                        <img 
                            src={product.image || "https://via.placeholder.com/600"} 
                            className="img-fluid rounded shadow" 
                            alt={product.name} 
                        />
                    </div>

                    {/* Columna Derecha: Información y Compra */}
                    <div className="col-md-6">
                        <h1 className="display-4">{product.name}</h1>
                        <h3 className="text-primary my-3">${product.price}</h3>
                        
                        <p className="lead">
                            {product.description || "Este producto no tiene descripción detallada."}
                        </p>

                        <hr className="my-4" />

                        <div className="d-flex gap-3">
                            {/* Botón de Comprar / Agregar al Carrito */}
                            <button 
                                className="btn btn-success btn-lg"
                                onClick={() => dispatch({ type: "add_to_cart", payload: product })}
                            >
                                <i className="fa-solid fa-cart-plus"></i> Agregar al Carrito
                            </button>

                            {/* Botón para volver */}
                            <Link to="/">
                                <span className="btn btn-outline-secondary btn-lg" role="button">
                                    Seguir comprando
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                // SI NO ENCONTRAMOS EL PRODUCTO (O si el usuario recargó la página aquí)
                <div className="text-center mt-5">
                    <h3>Producto no encontrado</h3>
                    <p className="text-muted">Parece que este zapato no existe o no se cargó correctamente.</p>
                    <Link to="/">
                        <button className="btn btn-primary">Volver al catálogo</button>
                    </Link>
                </div>
            )}
        </div>
    );
};