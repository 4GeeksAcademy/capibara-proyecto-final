import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const isLoggedIn = !!store.user;
  const isAdmin = !!store?.user?.is_admin; // ⭐ admin check

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "logout" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    handleNavigate("/login");
  };

  const handleNavigate = (path) => {
    const offcanvasEl = document.getElementById("mainMenu");
    if (window.bootstrap) {
      const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (bsOffcanvas) bsOffcanvas.hide();
    }
    navigate(path);
  };

  return (
    <nav className="navbar navbar-light bg-light sticky-top">
      <div className="container">
        {/* Brand */}
        <span
          className="navbar-brand mb-0 h1"
          style={{ cursor: "pointer" }}
          onClick={() => handleNavigate("/")}
        >
          👟 ShoeStore
        </span>

        {/* Desktop buttons */}
        <div className="ms-auto d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary d-none d-md-block"
            onClick={() => handleNavigate("/shoes")}
          >
            Sobre Nosotros
          </button>

          <button
            className="btn btn-outline-dark d-none d-md-block"
            onClick={() => handleNavigate("/catalog")}
          >
            Ver Catálogo
          </button>

          {/* Cart */}
          <button
            className="btn btn-primary position-relative"
            onClick={() => handleNavigate("/cart")}
          >
            <i className="fa-solid fa-cart-shopping"></i> Carrito
            {store.cart.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {store.cart.length}
              </span>
            )}
          </button>

          {/* ⭐ ADMIN BUTTON (desktop) */}
          {isAdmin && (
            <button
              className="btn btn-warning d-none d-md-block"
              onClick={() => handleNavigate("/admin")}
            >
              <i className="fa-solid fa-shield-halved me-2"></i> Admin
            </button>
          )}

          {/* Hamburger */}
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mainMenu"
            aria-controls="mainMenu"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          {/* Offcanvas menu */}
          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="mainMenu"
            aria-labelledby="mainMenuLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">Menu</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
              ></button>
            </div>

            <div className="offcanvas-body">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <span className="nav-link" onClick={() => handleNavigate("/")}>
                    <i className="fa-solid fa-house"></i> Home
                  </span>
                </li>

                <li className="nav-item">
                  <span className="nav-link" onClick={() => handleNavigate("/catalog")}>
                    <i className="fa-solid fa-store"></i> Catálogo
                  </span>
                </li>

                <li className="nav-item">
                  <span className="nav-link" onClick={() => handleNavigate("/shoes")}>
                    <i className="fa-solid fa-circle-info"></i> Sobre Nosotros
                  </span>
                </li>

                <hr />

                {store.user ? (
                  <>
                    <li className="nav-item">
                      <span className="nav-link" onClick={() => handleNavigate("/editprofile")}>
                        <i className="fa-solid fa-user"></i> My Account
                      </span>
                    </li>

                    {/* ⭐ ADMIN LINK (mobile menu) */}
                    {isAdmin && (
                      <li className="nav-item">
                        <span
                          className="nav-link"
                          onClick={() => handleNavigate("/admin")}
                        >
                          <i className="fa-solid fa-shield-halved"></i> Admin Panel
                        </span>
                      </li>
                    )}

                    <hr />

                    <li className="nav-item">
                      <button
                        className="nav-link text-danger btn btn-link"
                        onClick={handleLogout}
                      >
                        <i className="fa-solid fa-right-from-bracket"></i> Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <button
                        className="nav-link btn btn-link"
                        onClick={() => handleNavigate("/login")}
                      >
                        <i className="fa-solid fa-right-to-bracket"></i> Login
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        className="nav-link btn btn-link"
                        onClick={() => handleNavigate("/signup")}
                      >
                        <i className="fa-solid fa-user-plus"></i> Signup
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
