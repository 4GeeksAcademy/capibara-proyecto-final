import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Admin = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingShoe, setEditingShoe] = useState(null);
  const [formData, setFormData] = useState({
    brand: "",
    name: "",
    price: "",
    img_url: "",
  });
  const [msg, setMsg] = useState("");

  // Check if user is admin and fetch shoes
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");

    if (!isAdmin || !store.token || !store.user?.is_admin) {
      navigate("/admin/login");
    } else {
      fetchShoes();
    }
  }, [store.token, store.user]);

  // Fetch all shoes
  const fetchShoes = async () => {
    try {
      const res = await fetch(`${backendUrl}api/shoes`);

      if (!res.ok) {
        throw new Error("Failed to fetch shoes");
      }

      const data = await res.json();
      setShoes(data);
    } catch (error) {
      console.error("Error fetching shoes:", error);
      setMsg(`⚠️ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new shoe
  const handleAddShoe = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch(`${backendUrl}api/shoe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Check if it's a 401 (token expired)
        if (res.status === 401) {
          setMsg("⚠️ Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("isAdmin");
          dispatch({ type: "logout" });
          setTimeout(() => navigate("/admin/login"), 2000);
          return;
        }
        throw new Error(data.msg || "Failed to add shoe");
      }

      // Dispatch admin add product
      dispatch({
        type: "admin_add_product",
        payload: {
          id: data.shoe_id,
          brand: formData.brand,
          model_name: formData.name,
          price: parseFloat(formData.price),
          img_url: formData.img_url,
        },
      });

      setMsg("✅ Shoe added successfully!");
      setShowAddForm(false);
      setFormData({ brand: "", name: "", price: "", img_url: "" });
      fetchShoes();

      setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      setMsg(`⚠️ ${error.message}`);
      console.error("Error adding shoe:", error);
    }
  };

  // Update shoe
  const handleUpdateShoe = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch(`${backendUrl}api/shoes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.token}`,
        },
        body: JSON.stringify({
          shoe_id: editingShoe.id,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Check if it's a 401 (token expired)
        if (res.status === 401) {
          setMsg("⚠️ Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("isAdmin");
          dispatch({ type: "logout" });
          setTimeout(() => navigate("/admin/login"), 2000);
          return;
        }
        throw new Error(data.msg || "Failed to update shoe");
      }

      // Dispatch admin update product
      dispatch({
        type: "admin_update_product",
        payload: {
          id: editingShoe.id,
          brand: formData.brand,
          model_name: formData.name,
          price: parseFloat(formData.price),
          img_url: formData.img_url,
        },
      });

      setMsg("✅ Shoe updated successfully!");
      setEditingShoe(null);
      setFormData({ brand: "", name: "", price: "", img_url: "" });
      fetchShoes();

      setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      setMsg(`⚠️ ${error.message}`);
      console.error("Error updating shoe:", error);
    }
  };

  // Delete shoe
  const handleDeleteShoe = async (shoe) => {
    if (!window.confirm("Are you sure you want to delete this shoe?")) return;

    setMsg("");

    try {
      const res = await fetch(`${backendUrl}api/shoes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.token}`,
        },
        body: JSON.stringify({ shoe_id: shoe.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Check if it's a 401 (token expired)
        if (res.status === 401) {
          setMsg("⚠️ Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("isAdmin");
          dispatch({ type: "logout" });
          setTimeout(() => navigate("/admin/login"), 2000);
          return;
        }
        throw new Error(data.msg || "Failed to delete shoe");
      }

      // Dispatch admin delete product
      dispatch({
        type: "admin_delete_product",
        payload: { id: shoe.id },
      });

      setMsg("✅ Shoe deleted successfully!");
      fetchShoes();

      setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      setMsg(`⚠️ ${error.message}`);
      console.error("Error deleting shoe:", error);
    }
  };

  // Start editing
  const startEdit = (shoe) => {
    setEditingShoe(shoe);
    setFormData({
      brand: shoe.brand,
      name: shoe.model_name,
      price: shoe.price,
      img_url: shoe.img_url || "",
    });
    setShowAddForm(false);
    setMsg("");
  };

  // Logout
  const handleLogout = () => {
    dispatch({ type: "logout" });
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h1>🛠️ Admin Dashboard</h1>
              <p className="text-muted">Welcome, {store.user?.email}</p>
            </div>
            <div>
              <button
                className="btn btn-success me-2"
                onClick={() => {
                  setShowAddForm(true);
                  setEditingShoe(null);
                  setFormData({ brand: "", name: "", price: "", img_url: "" });
                  setMsg("");
                }}
              >
                + Add New Shoe
              </button>
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {msg && (
        <div className={`alert ${msg.includes("✅") ? "alert-success" : "alert-danger"}`}>
          {msg}
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingShoe) && (
        <div className="row mb-4">
          <div className="col-lg-8 col-xl-6">
            <div className="card shadow">
              <div className="card-body p-4">
                <h4 className="mb-4">{editingShoe ? "✏️ Edit Shoe" : "➕ Add New Shoe"}</h4>

                <form onSubmit={editingShoe ? handleUpdateShoe : handleAddShoe}>
                  <div className="mb-3">
                    <label className="form-label">
                      Brand <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="brand"
                      className="form-control"
                      placeholder="e.g., Nike"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Model Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="e.g., Air Max 90"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Price <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      className="form-control"
                      placeholder="e.g., 120.00"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Image URL <small className="text-muted">(optional)</small>
                    </label>
                    <input
                      type="url"
                      name="img_url"
                      className="form-control"
                      placeholder="https://example.com/image.jpg"
                      value={formData.img_url}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">
                      {editingShoe ? "💾 Update Shoe" : "✅ Add Shoe"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingShoe(null);
                        setFormData({ brand: "", name: "", price: "", img_url: "" });
                        setMsg("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shoes List */}
      <h4>👟 All Shoes ({shoes.length})</h4>

      {shoes.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>No shoes yet. Add your first shoe to get started!</p>
        </div>
      ) : (
        shoes.map((shoe) => (
          <div key={shoe.id} className="card p-3 mb-2">
            <div className="row align-items-center">
              <div className="col-auto">
                {shoe.img_url ? (
                  <img
                    src={shoe.img_url}
                    alt={shoe.model_name}
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    className="rounded"
                  />
                ) : (
                  <div
                    className="bg-light rounded d-flex align-items-center justify-content-center text-muted"
                    style={{ width: "80px", height: "80px" }}
                  >
                    No Image
                  </div>
                )}
              </div>
              <div className="col">
                <h5>
                  {shoe.brand} - {shoe.model_name}
                </h5>
                <p className="mb-0">Price: ${parseFloat(shoe.price).toFixed(2)}</p>
              </div>
              <div className="col-auto">
                <button className="btn btn-warning me-2" onClick={() => startEdit(shoe)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteShoe(shoe)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};