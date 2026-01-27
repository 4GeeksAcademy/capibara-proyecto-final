import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom"; // Importamos Link para poder navegar al detalle

export const Home = () => {
    const { store, dispatch } = useGlobalReducer();

    const loadProducts = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            // Validación de seguridad para la URL
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            // 1. PETICIÓN A LA API
            // Asegúrate de que en tu backend (Flask) tengas un endpoint '/api/products'
            // que devuelva una lista de diccionarios (JSON).
            const response = await fetch(backendUrl + "/api/products");
            
            if (!response.ok) {
                throw new Error("No se pudieron cargar los productos. Revisa tu backend.");
            }

            const data = await response.json();

            // 2. DISPATCH (GUARDAR EN EL STORE)
            // Aquí usamos la acción 'load_products' que creamos en el paso anterior.
            dispatch({ type: "load_products", payload: data });

        } catch (error) {
            console.error("Error cargando productos:", error);
        }
    }

    useEffect(() => {
        // Ejecutamos la función apenas carga el componente
        loadProducts();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-5">Nuestra Colección</h1>
            
            <div className="row">
                {/* 3. RENDERIZADO DINÁMICO */}
                {/* Verificamos si hay productos en el store antes de intentar mapear */}
                {store.products && store.products.length > 0 ? (
                    store.products.map((product) => (
                        <div key={product.id} className="col-md-4 col-sm-6 mb-4">
                            <div className="card h-100 shadow-sm">
                                {/* Usamos un placeholder si el producto no tiene imagen aún */}
                                <img 
                                    src={product.image || "https://via.placeholder.com/300"} 
                                    className="card-img-top" 
                                    alt={product.name} 
                                    style={{ objectFit: "cover", height: "200px" }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text text-muted">
                                        {/* Ajusta estas propiedades según cómo se llamen en tu base de datos */}
                                        {product.description ? product.description.substring(0, 50) + "..." : "Sin descripción"}
                                    </p>
                                    <h4 className="text-primary mt-auto">${product.price}</h4>
                                    
                                    <div className="mt-3 d-flex justify-content-between">
                                        {/* Botón para ver detalle */}
                                        <Link to={"/single/" + product.id} className="btn btn-outline-primary">
                                            Ver más
                                        </Link>
                                        
                                        {/* Botón para agregar al carrito (Lo activaremos pronto) */}
                                        <button 
                                            className="btn btn-success"
                                            onClick={() => dispatch({ type: "add_to_cart", payload: product })}
                                        >
                                            <i className="fa-solid fa-cart-shopping"></i> Añadir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    // Mensaje de carga o error si no hay productos
                    <div className="col-12 text-center">
                        <div className="alert alert-warning" role="alert">
                            No hay productos disponibles o el backend no está conectado.
                            <br/>
                            <small>(Asegúrate de que tu Flask esté corriendo en el puerto 3001 y tenga la ruta /api/products)</small>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};