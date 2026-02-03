import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard"; // <--- Importamos la tarjeta

export const Home = () => {
    const { store, dispatch } = useGlobalReducer();

    const loadProducts = async () => {
        // NOTA: He comentado esto temporalmente para usar los datos de prueba (Mock Data)
        // del store.js mientras terminas el backend.
        /* try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");
            const response = await fetch(backendUrl + "/api/products");
            if (!response.ok) throw new Error("Error loading products");
            const data = await response.json();
            dispatch({ type: "load_products", payload: data });
        } catch (error) {
            console.error("Error cargando productos:", error);
        } 
        */
    };

    useEffect(() => {
        // Solo cargamos si la lista está vacía para no sobrescribir los datos de prueba
        if(store.products && store.products.length === 0) {
            loadProducts();
        }
    }, []);

    return (
        <div>
            {/* 1. HERO SECTION (CARRUSEL) */}
            <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>

                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img
                            src="https://images.unsplash.com/photo-1556906781-9a412961d28c?q=80&w=1200&auto=format&fit=crop"
                            className="d-block w-100"
                            style={{ height: "500px", objectFit: "cover", filter: "brightness(0.7)" }}
                            alt="Urban Shoes"
                        />
                        <div className="carousel-caption d-none d-md-block text-start">
                            <h2 className="display-3 fw-bold">Nueva Colección 2024</h2>
                            <p className="fs-4">Estilo urbano que define tu camino.</p>
                            <Link to="/catalog">
                                <button className="btn btn-primary btn-lg mt-3">Ver Catálogo</button>
                            </Link>
                        </div>
                    </div>

                    <div className="carousel-item">
                        <img
                            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop"
                            className="d-block w-100"
                            style={{ height: "500px", objectFit: "cover", filter: "brightness(0.7)" }}
                            alt="Running"
                        />
                        <div className="carousel-caption d-none d-md-block">
                            <h2 className="display-3 fw-bold">Corre sin límites</h2>
                            <p className="fs-4">Tecnología y confort en cada paso.</p>
                            <Link to="/catalog">
                                <button className="btn btn-outline-light btn-lg mt-3">Comprar Running</button>
                            </Link>
                        </div>
                    </div>

                    <div className="carousel-item">
                        <img
                            src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200&auto=format&fit=crop"
                            className="d-block w-100"
                            style={{ height: "500px", objectFit: "cover", filter: "brightness(0.7)" }}
                            alt="Sneakers"
                        />
                        <div className="carousel-caption d-none d-md-block text-end">
                            <h2 className="display-3 fw-bold">Clásicos Renovados</h2>
                            <p className="fs-4">Los favoritos de siempre, mejorados.</p>
                            <Link to="/catalog">
                                <button className="btn btn-warning btn-lg mt-3 text-dark fw-bold">Ver Ofertas</button>
                            </Link>
                        </div>
                    </div>
                </div>

                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            <div className="container mt-5">
                
                {/* 2. SECCIÓN DE BENEFICIOS */}
                <div className="row text-center mb-5 g-4">
                    <div className="col-md-4">
                        <div className="p-4 border rounded shadow-sm h-100">
                            <i className="fa-solid fa-truck-fast display-4 text-primary mb-3"></i>
                            <h4>Envío Gratis</h4>
                            <p className="text-muted">En compras superiores a $100.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 border rounded shadow-sm h-100">
                            <i className="fa-solid fa-shield-halved display-4 text-primary mb-3"></i>
                            <h4>Pago Seguro</h4>
                            <p className="text-muted">Transacciones 100% protegidas.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 border rounded shadow-sm h-100">
                            <i className="fa-solid fa-arrow-rotate-left display-4 text-primary mb-3"></i>
                            <h4>Devoluciones</h4>
                            <p className="text-muted">30 días de garantía de devolución.</p>
                        </div>
                    </div>
                </div>

                {/* 3. PRODUCTOS DESTACADOS */}
                <div className="row mb-4">
                    <div className="col-12 text-center">
                        <h2 className="display-5 fw-bold">Más Vendidos</h2>
                        <p className="lead text-muted">Descubre lo que todos están usando</p>
                    </div>
                </div>

                <div className="row g-4 mb-5">
                    {store.products && store.products.length > 0 ? (
                        // Mostramos solo los primeros 4 productos como "Destacados"
                        store.products.slice(0, 4).map((product) => (
                            <div key={product.id} className="col-12 col-md-6 col-lg-3">
                                <ProductCard product={product} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* 4. BANNER PROMOCIONAL INFERIOR */}
                <div className="bg-light p-5 rounded-3 mb-5 text-center">
                    <h2>Únete a nuestro club</h2>
                    <p className="lead">Recibe ofertas exclusivas y lanzamientos antes que nadie.</p>
                    <div className="d-flex justify-content-center gap-2">
                        <input type="email" className="form-control w-auto" placeholder="Tu email..." />
                        <button className="btn btn-dark">Suscribirse</button>
                    </div>
                </div>

            </div>
        </div>
    );
};