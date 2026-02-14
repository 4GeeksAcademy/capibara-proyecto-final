import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Admin = () => {
    const { store, dispatch } = useGlobalReducer();
    
    const [form, setForm] = useState({
        id: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        image_url: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddProduct = () => {
        dispatch({
            type: "admin_add_product",
            payload: {
                ...form,
                id: Date.now(), // Temporary ID generation      
            }
        });

        setForm({
            id: "",
            name: "",
            description: "",
            price: "",
            stock: "",
            image_url: "",
        });
    };

    const handleDeleteProduct = (product) => {
        dispatch({
            type: "admin_delete_product",
            payload: product,
        });
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Admin Panel</h1>
            {/* Add Product Form */}
            <div className="card p-3 mb-4">
                <h4>Add Product</h4>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control mb-2"
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="form-control mb-2"
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    className="form-control mb-2"
                />
                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="form-control mb-2"
                />
                <input
                    type="text"
                    name="image_url"
                    placeholder="Image URL"
                    value={form.image_url}
                    onChange={handleChange}
                    className="form-control mb-2"
                />

                <button className= "btn btn-primary" onClick={handleAddProduct}>
                    Add Product
                </button>
            </div>

            {/* Product List */}
            <h4>Product List</h4>


            {store.products.map((product) => (
                <div key={product.id} className="card p-3 mb-2">
                    <h5>{product.name}</h5>
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                    <p>Stock: {product.stock}</p>
                    <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteProduct(product)}
                    >
                        Delete Product
                    </button>
                </div>
            ))}
            </div>
    );
}