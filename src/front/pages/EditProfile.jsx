import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const EditProfile = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch existing profile data when component loads
        const fetchProfile = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
                const res = await fetch(`${backendUrl}/api/profile`, {
                    headers: {
                        "Authorization": `Bearer ${store.token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        first_name: data.first_name || "",
                        last_name: data.last_name || "",
                        phone_number: data.phone_number || "",
                        address: data.address || "",
                    });
                    dispatch({ type: "update_user", payload: { profile: data } });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (store.token) {
            fetchProfile();
        } else {
            navigate("/login");
        }
    }, [store.token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
            const res = await fetch(`${backendUrl}/api/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || "Error updating profile");
            }

            // Update global state
            dispatch({ type: "update_user", payload: { profile: data } });
            setMsg("✅ Profile updated successfully!");
            
        } catch (error) {
            setMsg(`⚠️ ${error.message}`);
            console.error("Update error:", error);
        }
    };

    if (loading) {
        return <div className="container mt-5">Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Edit Profile</h1>
            {msg && <div className={`alert ${msg.includes("✅") ? "alert-success" : "alert-warning"}`}>{msg}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                        type="tel"
                        className="form-control"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>

                <button type="submit" className="btn btn-primary">Update Profile</button>
                <button 
                    type="button" 
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/profile")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};