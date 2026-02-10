import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate(); // ✅ for redirect

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email  || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        alert(data.msg || "Login failed. Please check your credentials.");
        return;
      }

      

      // ✅ Save token & user to localStorage (persists after refresh)
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Update global store
      dispatch({
        type: "login_success",
        payload: {
          token: data.access_token,
          user: data.user,
        },
      });


      // ✅ Redirect to home after successful login
      navigate("/profile");

    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed (network/server error).");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row mb-5">
        <div className="col text-center">
          <h1 className="display-4">Login Page</h1>
          <p className="lead">Please enter your credentials to log in.</p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control mb-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control mb-3"
          />

          <button className="btn btn-dark btn-lg" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};
