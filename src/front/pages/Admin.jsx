import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import UploadImage from "../components/UploadImage";

export const Admin = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingShoe, setEditingShoe] = useState(null);
  const [formData, setFormData] = useState({ brand: "", name: "", price: "", img_url: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin || !store.token || !store.user?.is_admin) {
      navigate("/admin/login");
    } else {
      fetchShoes();
    }
  }, [store.token, store.user]);

  const fetchShoes = async () => {
    try {
      const res = await fetch(`${backendUrl}api/shoes`);
      if (!res.ok) throw new Error("Failed to fetch shoes");
      const data = await res.json();
      setShoes(data);
    } catch (error) {
      setMsg(`⚠️ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handle401 = () => {
    setMsg("⚠️ Session expired. Please login again.");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    dispatch({ type: "logout" });
    setTimeout(() => navigate("/admin/login"), 2000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingShoe(null);
    setFormData({ brand: "", name: "", price: "", img_url: "" });
    setMsg("");
  };

  const handleAddShoe = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${backendUrl}api/shoe`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${store.token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.status === 401) { handle401(); return; }
      if (!res.ok) throw new Error(data.msg || "Failed to add shoe");

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
      resetForm();
      fetchShoes();
      setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      setMsg(`⚠️ ${error.message}`);
    }
  };

  const handleUpdateShoe = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${backendUrl}api/shoes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${store.token}` },
        body: JSON.stringify({ shoe_id: editingShoe.id, ...formData }),
      });
      const data = await res.json();
      if (res.status === 401) { handle401(); return; }
      if (!res.ok) throw new Error(data.msg || "Failed to update shoe");

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
      resetForm();
      fetchShoes();
      setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      setMsg(`⚠️ ${error.message}`);
    }
  };

  const handleDeleteShoe = async (shoe) => {
    if (!window.confirm("Are you sure you want to delete this shoe?")) return;
    setMsg("");
    try {
      const res = await fetch(`${backendUrl}api/shoes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${store.token}` },
        body: JSON.stringify({ shoe_id: shoe.id }),
      });
      const data = await res.json();
      if (res.status === 401) { handle401(); return; }
      if (!res.ok) throw new Error(data.msg || "Failed to delete shoe");

      dispatch({ type: "admin_delete_product", payload: { id: shoe.id } });
      setMsg("✅ Shoe deleted successfully!");
      fetchShoes();
      setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      setMsg(`⚠️ ${error.message}`);
    }
  };

  const startEdit = (shoe) => {
    setEditingShoe(shoe);
    setFormData({ brand: shoe.brand, name: shoe.model_name, price: shoe.price, img_url: shoe.img_url || "" });
    setShowAddForm(false);
    setMsg("");
  };

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
    <div className="container mt-5 mb-5">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h1>🛠️ Admin Dashboard</h1>
              <p className="text-muted mb-0">Welcome, {store.user?.email}</p>
            </div>
            <div className="d-flex gap-2 mt-2 mt-sm-0">
              <button
                className="btn btn-success"
                onClick={() => {
                  setShowAddForm(true);
                  setEditingShoe(null);
                  setFormData({ brand: "", name: "", price: "", img_url: "" });
                  setMsg("");
                }}
              >
                + Add New Shoe
              </button>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
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
                    <label className="form-label">Brand <span className="text-danger">*</span></label>
                    <input type="text" name="brand" className="form-control" placeholder="e.g., Nike" value={formData.brand} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Model Name <span className="text-danger">*</span></label>
                    <input type="text" name="name" className="form-control" placeholder="e.g., Air Max 90" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Price <span className="text-danger">*</span></label>
                    <input type="number" step="0.01" name="price" className="form-control" placeholder="e.g., 120.00" value={formData.price} onChange={handleChange} required />
                  </div>

                  {/* Image */}
                  <div className="mb-3">
                    <label className="form-label">Image <small className="text-muted">(optional)</small></label>

                    {/* Preview */}
                    {formData.img_url && (
                      <div className="mb-2 d-flex align-items-center gap-2">
                        <img src={formData.img_url} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover" }} className="rounded border" />
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setFormData({ ...formData, img_url: "" })}>
                          ✕ Remove
                        </button>
                      </div>
                    )}

                    {/* Upload via Cloudinary */}
                    <UploadImage onUpload={(url) => setFormData({ ...formData, img_url: url })} />

                    {/* Manual URL fallback */}
                    <input type="url" name="img_url" className="form-control mt-2" placeholder="Or paste image URL manually" value={formData.img_url} onChange={handleChange} />
                  </div>

                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary" disabled={!formData.brand || !formData.name || !formData.price || !formData.img_url || formData.img_url === "Uploading... "}>
                      {editingShoe ? "💾 Update Shoe" : "✅ Add Shoe"}
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
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
      <h4 className="mb-3">👟 All Shoes ({shoes.length})</h4>

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
                  <img src={shoe.img_url} alt={shoe.model_name} style={{ width: "80px", height: "80px", objectFit: "cover" }} className="rounded" />
                ) : (
                  <div className="bg-light rounded d-flex align-items-center justify-content-center text-muted" style={{ width: "80px", height: "80px" }}>
                    No Image
                  </div>
                )}
              </div>
              <div className="col">
                <h5 className="mb-1">{shoe.brand} - {shoe.model_name}</h5>
                <p className="mb-0 text-muted">${parseFloat(shoe.price).toFixed(2)}</p>
              </div>
              <div className="col-auto">
                <button className="btn btn-warning me-2" onClick={() => startEdit(shoe)}>✏️ Edit</button>
                <button className="btn btn-danger" onClick={() => handleDeleteShoe(shoe)}>🗑️ Delete</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};