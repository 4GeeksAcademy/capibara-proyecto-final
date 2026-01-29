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
                
                <div className="ml-auto">
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
                </div>
            </div>
        </nav>
    );
};