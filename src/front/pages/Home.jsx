import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  const loadProducts = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");

      const response = await fetch(`${backendUrl}/api/shoes`);
      if (!response.ok) throw new Error("Error loading shoes");

      const data = await response.json();
      dispatch({ type: "load_shoes", payload: data });
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  useEffect(() => {
    if (!store.shoes || store.shoes.length === 0) {
      loadProducts();
    }
  }, [store.shoes]);

  return (
    <div>
      {/* 1. HERO CAROUSEL */}
      <div
        id="carouselExampleCaptions"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : undefined}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        <div className="carousel-inner">
          {/* Slide 1 */}
          <div className="carousel-item active">
            <img
              src="https://images.unsplash.com/photo-1556906781-9a412961d28c?q=80&w=1200&auto=format&fit=crop"
              className="d-block w-100"
              style={{
                height: "500px",
                objectFit: "cover",
                filter: "brightness(0.7)",
              }}
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

          {/* Slide 2 */}
          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop"
              className="d-block w-100"
              style={{
                height: "500px",
                objectFit: "cover",
                filter: "brightness(0.7)",
              }}
              alt="Running"
            />
            <div className="carousel-caption d-none d-md-block">
              <h2 className="display-3 fw-bold">Corre sin límites</h2>
              <p className="fs-4">Tecnología y confort en cada paso.</p>
              <Link to="/catalog">
                <button className="btn btn-outline-light btn-lg mt-3">
                  Comprar Running
                </button>
              </Link>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200&auto=format&fit=crop"
              className="d-block w-100"
              style={{
                height: "500px",
                objectFit: "cover",
                filter: "brightness(0.7)",
              }}
              alt="Sneakers"
            />
            <div className="carousel-caption d-none d-md-block text-end">
              <h2 className="display-3 fw-bold">Clásicos Renovados</h2>
              <p className="fs-4">Los favoritos de siempre, mejorados.</p>
              <Link to="/catalog">
                <button className="btn btn-warning btn-lg mt-3 text-dark fw-bold">
                  Ver Ofertas
                </button>
              </Link>
            </div>
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="container mt-5">
        {/* 2. BENEFITS SECTION */}
        <div className="row text-center mb-5 g-4">
          {[
            {
              icon: "fa-truck-fast",
              title: "Envío Gratis",
              desc: "En compras superiores a $100.",
            },
            {
              icon: "fa-shield-halved",
              title: "Pago Seguro",
              desc: "Transacciones 100% protegidas.",
            },
            {
              icon: "fa-arrow-rotate-left",
              title: "Devoluciones",
              desc: "30 días de garantía de devolución.",
            },
          ].map((benefit, idx) => (
            <div key={idx} className="col-md-4">
              <div className="p-4 border rounded shadow-sm h-100">
                <i
                  className={`fa-solid ${benefit.icon} display-4 text-primary mb-3`}
                ></i>
                <h4>{benefit.title}</h4>
                <p className="text-muted">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Featured Products */}
        <div className="row mb-4 text-center">
          <div className="col-12">
            <h2 className="display-5 fw-bold">Más Vendidos</h2>
            <p className="lead text-muted">Descubre lo que todos están usando</p>
          </div>
        </div>

        <div className="row g-4 mb-5">
          {store.shoes && store.shoes.length > 0 ? (
            store.shoes.slice(0, 4).map((product) => (
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

        {/* 4. Promotional Banner */}
        <div className="bg-light p-5 rounded-3 mb-5 text-center">
          <h2>Únete a nuestro club</h2>
          <p className="lead">Recibe ofertas exclusivas y lanzamientos antes que nadie.</p>
          <div className="d-flex justify-content-center gap-2">
            <input
              type="email"
              className="form-control w-auto"
              placeholder="Tu email..."
            />
            <button className="btn btn-dark">Suscribirse</button>
          </div>
        </div>
      </div>
    </div>
  );
};
