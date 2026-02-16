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
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
    });
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error for this field when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        // Confirm password
        if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = "Passwords do not match";
        }

        // First name validation
        if (!formData.first_name.trim()) {
            newErrors.first_name = "First name is required";
        }

        // Last name validation
        if (!formData.last_name.trim()) {
            newErrors.last_name = "Last name is required";
        }

        // Phone number validation (optional but validate if provided)
        if (formData.phone_number && !/^\+?[\d\s\-()]+$/.test(formData.phone_number)) {
            newErrors.phone_number = "Phone number is invalid";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Remove confirm_password before sending to backend
            const { confirm_password, ...signupData } = formData;

            const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
            if (!backendUrl) {
                throw new Error("Backend URL is not configured. Set VITE_BACKEND_URL in .env");
            }

            const res = await fetch(`${backendUrl}api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupData),
            });

            const data = await res.json();
            console.log("Signup response:", data);

            if (!res.ok) {
                throw new Error(data.msg || "Error signing up");
            }

            // ✅ Store all data in localStorage
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("profile", JSON.stringify(data.profile));

            // ✅ Update global state with user and profile info
            dispatch({
                type: "login_success",
                payload: {
                    token: data.access_token,
                    user: data.user,
                    profile: data.profile,  // ✅ Include profile
                }
            });

            // Success: show message and redirect to home/dashboard
            setMsg("✅ " + data.msg);
            setTimeout(() => navigate("/"), 1000);

        } catch (error) {
            setMsg(`⚠️ ${error.message}`);
            console.error("Signup error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h1 className="text-center mb-4">Sign Up</h1>
                            <p className="text-center text-muted mb-4">
                                Create an account to start shopping
                            </p>

                            {msg && (
                                <div className={`alert ${msg.includes("✅") ? "alert-success" : "alert-danger"}`}>
                                    {msg}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Email */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Email Address <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">{errors.email}</div>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Password <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Min. 6 characters"
                                        required
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">{errors.password}</div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Confirm Password <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.confirm_password ? "is-invalid" : ""}`}
                                        name="confirm_password"
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        placeholder="Re-enter password"
                                        required
                                    />
                                    {errors.confirm_password && (
                                        <div className="invalid-feedback">{errors.confirm_password}</div>
                                    )}
                                </div>

                                {/* First Name and Last Name */}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            First Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            placeholder="John"
                                            required
                                        />
                                        {errors.first_name && (
                                            <div className="invalid-feedback">{errors.first_name}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Last Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            required
                                        />
                                        {errors.last_name && (
                                            <div className="invalid-feedback">{errors.last_name}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Phone Number (Optional) */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Phone Number <small className="text-muted">(optional)</small>
                                    </label>
                                    <input
                                        type="tel"
                                        className={`form-control ${errors.phone_number ? "is-invalid" : ""}`}
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                    {errors.phone_number && (
                                        <div className="invalid-feedback">{errors.phone_number}</div>
                                    )}
                                </div>

                                {/* Address (Optional) */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Address <small className="text-muted">(optional)</small>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="2"
                                        placeholder="123 Main St, City, State, ZIP"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Creating Account...
                                        </>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </button>
                            </form>

                            {/* Login Link */}
                            <div className="text-center mt-3">
                                <p className="mb-0">
                                    Already have an account?{" "}
                                    <a href="/login" className="text-decoration-none fw-bold">
                                        Sign in
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-muted mt-3">
                        <small>* Required fields</small>
                    </p>
                </div>
            </div>
        </div>
    );
};