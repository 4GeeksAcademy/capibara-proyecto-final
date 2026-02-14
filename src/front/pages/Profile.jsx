import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
  });

  useEffect(() => {
    if (!store.user) {
      setLoading(false);
      return;
    }

    // If user already has a profile, redirect or show message
    if (store.user.profile) {
      setMsg("✅ You already have a profile.");
    }

    setLoading(false);
  }, [store.user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const token = store.token || localStorage.getItem("token");
    if (!token) {
      setMsg("⚠️ You must be logged in to create a profile");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMsg(`⚠️ ${data.msg || "Error creating profile"}`);
        return;
      }

      // Update global store with new profile
      dispatch({
        type: "update_user",
        payload: { profile: data.profile },
      });

      setMsg("✅ Profile created successfully!");
      navigate("/editprofile");
    } catch (err) {
      console.error(err);
      setMsg("⚠️ Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  if (!store.user) {
    return (
      <div className="container mt-5 text-center">
        <h2>You are not logged in</h2>
        <p>Please log in to create your profile</p>
        <Link to="/login" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }
  console.log("Fetching:", `${import.meta.env.VITE_BACKEND_URL}api/profile`);

  return (
    <div className="container mt-5">
      {msg && <div className="alert alert-info">{msg}</div>}

      <h2>Create Your Profile</h2>

      <form onSubmit={handleSubmit} className="mt-3">
        {["first_name", "last_name", "phone_number", "address"].map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label">
              {field.replace("_", " ").toUpperCase()}
            </label>
            <input
              type="text"
              name={field}
              className="form-control"
              value={formData[field]}
              onChange={handleChange}
              required={field.includes("name")}
            />
          </div>
        ))}

        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? "Creating..." : "Create Profile"}
        </button>
      </form>
    </div>
  );
};
