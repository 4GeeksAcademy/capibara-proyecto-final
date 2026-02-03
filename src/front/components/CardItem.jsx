import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const CartItem = ({ item }) => {
    const { dispatch } = useGlobalReducer();

    const removeItem = () => {
        dispatch({
            type: "remove_from_cart",
            payload: { id: item.id }
        });
    };

    return (
        <div className="card mb-3 shadow-sm">
            <div className="row g-0 align-items-center">
                <div className="col-md-2 text-center p-2">
                    <img 
                        src={item.image_url || "https://via.placeholder.com/100"} 
                        className="img-fluid rounded" 
                        alt={item.name} 
                        style={{ maxHeight: "100px" }}
                    />
                </div>
                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text text-muted small">Precio Unitario: ${item.price}</p>
                    </div>
                </div>
                <div className="col-md-2 text-center">
                    <h5 className="mb-0">${item.price}</h5>
                </div>
                <div className="col-md-2 text-center">
                    <button className="btn btn-outline-danger btn-sm" onClick={removeItem}>
                        <i className="fa-solid fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};