import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!formData.email || !formData.password) {
      setMsg("⚠️ Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
      if (!backendUrl) {
        throw new Error("Backend URL is not configured. Set VITE_BACKEND_URL in .env");
      }

      const response = await fetch(`${backendUrl}api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.msg || "Invalid credentials");
      }

      // ✅ Store all data in localStorage
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      if (data.profile) {
        localStorage.setItem("profile", JSON.stringify(data.profile));
      }

      // ✅ Update global store with all data
      dispatch({
        type: "login_success",
        payload: {
          token: data.access_token,
          user: data.user,
          profile: data.profile,  // ✅ Include profile
        },
      });

      // Success message
      setMsg("✅ Login successful! Redirecting...");

      // Redirect to home after successful login
      setTimeout(() => navigate("/"), 1000);

    } catch (error) {
      console.error("Login error:", error);
      setMsg(`⚠️ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h1 className="text-center mb-4">Welcome Back</h1>
              <p className="text-center text-muted mb-4">
                Log in to your account
              </p>

              {msg && (
                <div className={`alert ${msg.includes("✅") ? "alert-success" : "alert-danger"}`}>
                  {msg}
                </div>
              )}

              <form onSubmit={handleLogin}>
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
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
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              {/* Signup Link */}
              <div className="text-center mt-3">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-decoration-none fw-bold">
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};