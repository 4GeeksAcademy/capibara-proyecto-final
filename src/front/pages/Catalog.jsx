import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ProductCard } from "../components/ProductCard";
import { Link } from "react-router-dom";

export const Catalog = () => {
    const { store, dispatch } = useGlobalReducer();

    const loadShoes = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");
            
            const response = await fetch(backendUrl + "/api/shoes");
            if (!response.ok) throw new Error("Error loading shoes");
            
            const data = await response.json();
            // ✅ Usamos "products" para coincidir con el reducer optimizado
            dispatch({ type: "load_products", payload: data }); 
        } catch (error) {
            console.error("Error loading products:", error);
        }
    };
    
    useEffect(() => {
        // ✅ Validamos store.products en lugar de store.shoes
        if (!store.products || store.products.length === 0) {
            loadShoes();
        }
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">Nuestra Colección</h1>
                <Link to="/" className="btn btn-sm btn-outline-secondary">
                    <i className="fa-solid fa-house me-2"></i>Inicio
                </Link>
            </div>

            {/* ✅ Mapeamos sobre store.products */}
            {store.products && store.products.length > 0 ? (
                <div className="row g-4">
                    {store.products.map((shoe) => (
                        <div key={shoe.id} className="col-12 col-md-6 col-lg-3">
                            <ProductCard product={shoe} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2 text-muted">Buscando los mejores zapatos para ti...</p>
                </div>
            )}
        </div>
    );
};