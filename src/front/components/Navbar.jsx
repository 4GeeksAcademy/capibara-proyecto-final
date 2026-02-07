import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
    // Conexion del store para leer el carrito
    const { store, dispatch } = useGlobalReducer();

    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "logout" });
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-light bg-light sticky-top">
            <div className="container">
                <Link to="/" className="text-decoration-none">
                    <span className="navbar-brand mb-0 h1">👟 ShoeStore</span>
                </Link>
                
                {/* Corregido d-felx a d-flex y gap2 a gap-2 */}
                <div className="ml-auto d-flex align-items-center gap-2">
                    
                    {/* NUEVO: Botón directo al Catálogo (visible en desktop) */}
                    <Link to="/catalog">
                        <button className="btn btn-outline-dark d-none d-md-block">
                            Ver Catálogo
                        </button>
                    </Link>

                    {/* Actualizado: Ahora apunta a '/cart' en lugar de '/demo' */}
                    <Link to="/cart">
                        <button className="btn btn-primary position-relative">
                            <i className="fa-solid fa-cart-shopping"></i> Carrito
                            
                            {/* Badge de cantidad */}
                            {store.cart.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {store.cart.length}
                                </span>
                            )}
                        </button>
                    </Link>

                    {/* Hamburger Button */}
                    <button className="btn btn-primary"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#mainMenu"
                      aria-controls="mainMenu">
                    <i className="fa-solid fa-bars"></i>
                    </button>

                    {/* Offcanvas Menu */}
                    <div
                      className="offcanvas offcanvas-end"
                      tabIndex="-1"
                      id="mainMenu"
                      aria-labelledby="mainMenuLabel"
                    >
                      <div className="offcanvas-header">
                      <h5 className="offcanvas-title" id="mainMenuLabel">Menu</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                      </div>

                    <div className="offcanvas-body">
                        <ul className="navbar-nav">
                            {/* Agregamos Home y Catálogo al menú móvil también */}
                            <li className="nav-item">
                                <Link className="nav-link" to="/" data-bs-dismiss="offcanvas"> 
                                <i className="fa-solid fa-house"></i> Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/catalog" data-bs-dismiss="offcanvas"> 
                                <i className="fa-solid fa-store"></i> Catálogo
                                </Link>
                            </li>
                            
                            <hr />

                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">
                                <i className="fa-solid fa-user"></i> My Account
                                </Link>

                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/orders" data-bs-dismiss="offcanvas">
                                <i className="fa-solid fa-box"></i> Orders
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/settings" data-bs-dismiss="offcanvas">
                                <i className="fa-solid fa-gear"></i> Settings
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/signup">
                                <i className="fa-solid fa-user-plus"></i> Sign Up
                                </Link>
                            </li>

                            
                            <hr/>
                            <li className="nav-item">
                                <button
                                 className="nav-link text-danger btn btn-link"
                                onClick={handleLogout}
                            >
                            <i className="fa-solid fa-right-from-bracket"></i> Logout
                             </button>
                            </li>
                        </ul>
                    </div>
                  </div>
                </div>
            </div>
        </nav>
    );
};