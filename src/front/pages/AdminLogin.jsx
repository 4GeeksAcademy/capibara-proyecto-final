import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AdminLogin = () => {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
      const res = await fetch(`${backendUrl}api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Login failed");
      }

      // Dispatch login action
      dispatch({
        type: "login_success",
        payload: {
          token: data.access_token,
          user: data.user,
          profile: null,
        },
      });

      setMsg("✅ Login successful!");

      // Redirect based on user type
      setTimeout(() => {
        if (data.user.is_admin) {
          // If admin, redirect to admin dashboard
          localStorage.setItem("isAdmin", "true");
          navigate("/admin");
        } else {
          // Regular user goes to home or catalog
          navigate("/catalog");
        }
      }, 1000);
    } catch (error) {
      setMsg(`⚠️ ${error.message}`);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h1 className="text-center mb-4">Login</h1>

              {msg && (
                <div className={`alert ${msg.includes("✅") ? "alert-success" : "alert-danger"}`}>
                  {msg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
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

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <p className="text-muted mb-2">Don't have an account?</p>
                <Link to="/signup" className="btn btn-outline-secondary w-100">
                  Sign Up
                </Link>
              </div>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Are you an admin? <Link to="/admin/login">Admin Login</Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};