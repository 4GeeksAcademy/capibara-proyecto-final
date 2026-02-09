import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Signup = () => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirm_password: "",
    });
    const [msg, setMsg] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");

        if (formData.password !== formData.confirm_password) {
            setMsg("⚠️ Passwords do not match");
            return;
        }

        try {
            // Only send email and password to the backend
            const { confirm_password, ...signupData } = formData;

            const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
            if (!backendUrl) {
                throw new Error("Backend URL is not configured. Set VITE_BACKEND_URL in .env");
            }

            const res = await fetch(`${backendUrl}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupData),
            });

            const data = await res.json();
            console.log("Signup response:", data);

            if (!res.ok) {
                throw new Error(data.msg || "Error signing up");
            }

            // Success: show message and redirect to login
            setMsg("✅ " + data.msg);
            setTimeout(() => navigate("/login"), 1500);
            
        } catch (error) {
            setMsg(`⚠️ ${error.message}`);
            console.error("Signup error:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Sign Up</h1>
            {msg && <div className={`alert ${msg.includes("✅") ? "alert-success" : "alert-warning"}`}>{msg}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    );
};