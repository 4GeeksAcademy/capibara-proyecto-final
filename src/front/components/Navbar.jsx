import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
    // Conexion del store para leer el carrito
    const { store } = useGlobalReducer();

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link to="/" className="text-decoration-none">
                    <span className="navbar-brand mb-0 h1">👟 ShoeStore</span>
                </Link>
                
                <div className="ml-auto d-felx gap2">
                    {/* Se redirige al usuario a '/demo', que será la página del Carrito */}
                    <Link to="/demo">
                        <button className="btn btn-primary position-relative">
                            <i className="fa-solid fa-cart-shopping"></i> Carrito
                            
                            {/* Este badge muestra el número de items si el carrito tiene algo */}
                            {store.cart.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {store.cart.length}
                                </span>
                            )}
                        </button>
                    </Link>

                    {/* Hamburger */}
                    <button className="btn btn-primary"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#mainMenu"
                      aria-controls="mainMenu">
                    <i className="fa-solid fa-bars"></i>
                    </button>

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
                <li className="nav-item">
                <Link className="nav-link" to="/account" data-bs-dismiss="offcanvas"> 
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
                
                <hr/>
                <li className="nav-item">
                <Link className="nav-link text-danger" to="/logout" data-bs-dismiss="offcanvas">
                <i className="fa-solid fa-right-from-bracket"></i> Logout
                </Link>
                </li>
                </ul>




        </div>
      </div>

      


                    
                </div>
            </div>
        </nav>
    );
};