import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

export const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!store.user) {
      setLoading(false);
      return;
    }

    // If profile exists in user object, use it
    if (store.user.profile) {
      setProfile(store.user.profile);
      setFormData({
        first_name: store.user.profile.first_name || "",
        last_name: store.user.profile.last_name || "",
        phone_number: store.user.profile.phone_number || "",
        address: store.user.profile.address || "",
      });
    }

    setLoading(false);
  }, [store.user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const token = store.token || localStorage.getItem("token");
    if (!token) {
      setMsg("⚠️ You must be logged in to create or update a profile");
      return;
    }

    setSubmitting(true);

    try {
      // Choose POST for create, PUT for update
      const method = profile ? "PUT" : "POST";

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          phone_number: formData.phone_number.trim(),
          address: formData.address.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setProfile(formData);
        setMsg(profile ? "✅ Profile updated successfully!" : "✅ Profile created successfully!");

        // Update global store
        dispatch({ type: "update_user", payload: { ...store.user, profile: formData } });
      } else {
        setMsg(`⚠️ ${data.msg || "Error saving profile"}`);
      }
    } catch (err) {
      console.error(err);
      setMsg("⚠️ Something went wrong. Please try again.");
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
        <p>Please log in to see your profile</p>
        <Link to="/login" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {msg && <div className="alert alert-info">{msg}</div>}

      {profile ? (
        <>
          <h2>My Profile</h2>
          <img
            src={store.user.avatar_url || "https://via.placeholder.com/150"}
            width="150"
            className="rounded-circle mb-3"
            alt="avatar"
          />
        </>
      ) : (
        <h2>Create Your Profile</h2>
      )}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            name="first_name"
            className="form-control"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            name="last_name"
            className="form-control"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            className="form-control"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (profile ? "Updating..." : "Creating...") : profile ? "Update Profile" : "Create Profile"}
        </button>
      </form>

      {profile && (
        <div className="mt-4">
          <p>
            <strong>Name:</strong> {profile.first_name} {profile.last_name}
          </p>
          <p>
            <strong>Email:</strong> {store.user.email}
          </p>
          {profile.phone_number && (
            <p>
              <strong>Phone:</strong> {profile.phone_number}
            </p>
          )}
          {profile.address && (
            <p>
              <strong>Address:</strong> {profile.address}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
