import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const EditProfile = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
  });
  const [editMode, setEditMode] = useState({
    first_name: false,
    last_name: false,
    phone_number: false,
    address: false,
  });
  const [tempData, setTempData] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
        const res = await fetch(`${backendUrl}api/profile`, {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setMsg("⚠️ Sesión expirada. Por favor inicia sesión de nuevo.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("profile");
            dispatch({ type: "logout" });
            setTimeout(() => navigate("/login"), 2000);
            return;
          }
          throw new Error("Error al cargar perfil");
        }

        const data = await res.json();
        setProfile(data);
        dispatch({ type: "update_user", payload: data });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMsg(`⚠️ ${error.message}`);
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

  const startEdit = (field) => {
    setTempData({ ...tempData, [field]: profile[field] });
    setEditMode({ ...editMode, [field]: true });
  };

  const cancelEdit = (field) => {
    setEditMode({ ...editMode, [field]: false });
    setTempData({ ...tempData, [field]: "" });
  };

  const saveField = async (field) => {
    setMsg("");

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
      const updatedData = { ...profile, [field]: tempData[field] };

      const res = await fetch(`${backendUrl}api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setMsg("⚠️ Sesión expirada. Por favor inicia sesión de nuevo.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("profile");
          dispatch({ type: "logout" });
          setTimeout(() => navigate("/login"), 2000);
          return;
        }
        throw new Error(data.msg || "Error al actualizar");
      }

      setProfile(data.profile);
      dispatch({ type: "update_user", payload: data.profile });
      setEditMode({ ...editMode, [field]: false });
      setMsg("✅ Campo actualizado exitosamente!");
      setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      setMsg(`⚠️ ${error.message}`);
      console.error("Update error:", error);
    }
  };

  const handleLogout = () => {
    dispatch({ type: "logout" });
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="container mt-5 mb-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-1">👤 Mi Perfil</h2>
                  <p className="text-muted mb-0">{store.user?.email}</p>
                </div>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Message */}
          {msg && (
            <div className={`alert ${msg.includes("✅") ? "alert-success" : "alert-danger"}`}>
              {msg}
            </div>
          )}

          {/* Profile Fields */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="mb-4">Información Personal</h5>

              {/* First Name */}
              <div className="mb-4 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="fw-bold text-muted small">NOMBRE</label>
                  {!editMode.first_name && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => startEdit("first_name")}
                    >
                      <i className="fa-solid fa-pen"></i> Editar
                    </button>
                  )}
                </div>
                {editMode.first_name ? (
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      value={tempData.first_name}
                      onChange={(e) =>
                        setTempData({ ...tempData, first_name: e.target.value })
                      }
                      autoFocus
                    />
                    <button
                      className="btn btn-success"
                      onClick={() => saveField("first_name")}
                    >
                      <i className="fa-solid fa-check"></i>
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => cancelEdit("first_name")}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ) : (
                  <p className="mb-0 fs-5">
                    {profile.first_name || <span className="text-muted fst-italic">No establecido</span>}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="mb-4 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="fw-bold text-muted small">APELLIDO</label>
                  {!editMode.last_name && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => startEdit("last_name")}
                    >
                      <i className="fa-solid fa-pen"></i> Editar
                    </button>
                  )}
                </div>
                {editMode.last_name ? (
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      value={tempData.last_name}
                      onChange={(e) =>
                        setTempData({ ...tempData, last_name: e.target.value })
                      }
                      autoFocus
                    />
                    <button
                      className="btn btn-success"
                      onClick={() => saveField("last_name")}
                    >
                      <i className="fa-solid fa-check"></i>
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => cancelEdit("last_name")}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ) : (
                  <p className="mb-0 fs-5">
                    {profile.last_name || <span className="text-muted fst-italic">No establecido</span>}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="mb-4 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="fw-bold text-muted small">TELÉFONO</label>
                  {!editMode.phone_number && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => startEdit("phone_number")}
                    >
                      <i className="fa-solid fa-pen"></i> Editar
                    </button>
                  )}
                </div>
                {editMode.phone_number ? (
                  <div className="d-flex gap-2">
                    <input
                      type="tel"
                      className="form-control"
                      value={tempData.phone_number}
                      onChange={(e) =>
                        setTempData({ ...tempData, phone_number: e.target.value })
                      }
                      placeholder="+1 (555) 123-4567"
                      autoFocus
                    />
                    <button
                      className="btn btn-success"
                      onClick={() => saveField("phone_number")}
                    >
                      <i className="fa-solid fa-check"></i>
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => cancelEdit("phone_number")}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ) : (
                  <p className="mb-0 fs-5">
                    {profile.phone_number || <span className="text-muted fst-italic">No establecido</span>}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="mb-0">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="fw-bold text-muted small">DIRECCIÓN</label>
                  {!editMode.address && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => startEdit("address")}
                    >
                      <i className="fa-solid fa-pen"></i> Editar
                    </button>
                  )}
                </div>
                {editMode.address ? (
                  <div>
                    <textarea
                      className="form-control mb-2"
                      value={tempData.address}
                      onChange={(e) =>
                        setTempData({ ...tempData, address: e.target.value })
                      }
                      rows="3"
                      placeholder="123 Main St, Ciudad, Estado, CP"
                      autoFocus
                    />
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success"
                        onClick={() => saveField("address")}
                      >
                        <i className="fa-solid fa-check"></i> Guardar
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => cancelEdit("address")}
                      >
                        <i className="fa-solid fa-xmark"></i> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mb-0 fs-5">
                    {profile.address || <span className="text-muted fst-italic">No establecida</span>}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};