import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "logout" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Use handleNavigate after logout to ensure menu closes
    handleNavigate("/");
  };

  const handleNavigate = (path) => {
    // Safely close the offcanvas menu if it is open
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
        {/* Brand Link */}
        <span
          className="navbar-brand mb-0 h1"
          style={{ cursor: "pointer" }}
          onClick={() => handleNavigate("/")}
        >
          👟 ShoeStore
        </span>

        {/* Desktop buttons and Links */}
        <div className="ms-auto d-flex align-items-center gap-2">
          {/* Desktop link to About page */}
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

          {/* Hamburger menu */}
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
              <h5 className="offcanvas-title" id="mainMenuLabel">
                Menu
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>

            <div className="offcanvas-body">
              <ul className="navbar-nav">
                {/* Always visible links */}
                <li className="nav-item">
                  <span
                    className="nav-link"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleNavigate("/")}
                  >
                    <i className="fa-solid fa-house"></i> Home
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleNavigate("/catalog")}
                  >
                    <i className="fa-solid fa-store"></i> Catálogo
                  </span>
                </li>
                
                {/* Added mobile/offcanvas link to About page */}
                <li className="nav-item">
                  <span
                    className="nav-link"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleNavigate("/shoes")}
                  >
                    <i className="fa-solid fa-circle-info"></i> Sobre Nosotros
                  </span>
                </li>

                <hr />

                {/* Conditional links */}
                {store.user ? (
                  <>
                    <li className="nav-item">
                      <span
                        className="nav-link"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleNavigate("/editprofile")}
                      >
                        <i className="fa-solid fa-user"></i> My Account
                      </span>
                    </li>
                    <li className="nav-item">
                      <span
                        className="nav-link"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleNavigate("/orders")}
                      >
                        <i className="fa-solid fa-box"></i> Orders
                      </span>
                    </li>
                    <li className="nav-item">
                      <span
                        className="nav-link"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleNavigate("/settings")}
                      >
                        <i className="fa-solid fa-gear"></i> Settings
                      </span>
                    </li>

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
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={() => handleNavigate("/login")}
                    >
                      <i className="fa-solid fa-right-to-bracket"></i> Login
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};