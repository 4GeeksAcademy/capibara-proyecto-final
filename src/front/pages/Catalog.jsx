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
            dispatch({ type: "load_shoes", payload: data });
        } catch (error) {
            console.error("Error loading products:", error);
        }
    };

    useEffect(() => {
        if (!store.shoes || store.shoes.length === 0) loadShoes();
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="display-5">Our Shoes</h1>
                <Link to="/" className="btn btn-outline-secondary">Back Home</Link>
            </div>

            {store.shoes && store.shoes.length > 0 ? (
                <div className="row g-4">
                    {store.shoes.map((shoe) => (
                        <div key={shoe.id} className="col-12 col-md-6 col-lg-3">
                            <ProductCard product={shoe} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
};
