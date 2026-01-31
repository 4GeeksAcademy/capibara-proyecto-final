import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

export const Home = () => {
    const { store, dispatch } = useGlobalReducer();

    const loadProducts = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;


            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

            const response = await fetch(backendUrl + "/api/products");
            
            if (!response.ok) {
                throw new Error("No se pudieron cargar los productos. Revisa tu backend.");
            }

            const data = await response.json();

            dispatch({ type: "load_products", payload: data });

        } catch (error) {
            console.error("Error cargando productos:", error);
        }
    };

	useEffect(() => {
		loadProducts()
	}, []);

	return (
		<div className="container mt-5">
			<div className="row mb-5">
        <div className="col text-center">
          <h1 className="display-4">Nombre del sitio</h1>
          <p className="lead">Urban shoes for everyone</p>
          <button className="btn btn-dark btn-lg">Shop now</button>
        </div>
      </div>

     <div className="row g-4 mb-5">
        <div className="col-6 col-md-3">
          <div className="card p-4 text-center">Image</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card p-4 text-center">Image</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card p-4 text-center">Image</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card p-4 text-center">Image</div>
        </div>
      </div>

    <div id="carouselExampleCaptions" class="carousel slide">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>

  <div className="carousel-inner">
    <div className="carousel-item active">
      <img
        src="https://images.unsplash.com/photo-1603243287375-d59753944627?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className="d-block w-100"
        style={{ height: "450px", objectFit: "cover" }}
        alt="Converse shoes"
      />
      <div className="carousel-caption d-none d-md-block">
        <h5>First slide</h5>
        <p>Urban style sneakers.</p>
      </div>
    </div>

    <div className="carousel-item">
      <img
        src="https://images.unsplash.com/photo-1527128296579-fce16948f060?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className="d-block w-100"
        style={{ height: "450px", objectFit: "cover" }}
        alt="Sneakers"
      />
      <div className="carousel-caption d-none d-md-block">
        <h5>Second slide</h5>
        <p>Comfort and design.</p>
      </div>
    </div>

    <div className="carousel-item">
      <img
        src="https://images.unsplash.com/photo-1670181830277-e6db6b34cc3f?q=80&w=1200&auto=format&fit=crop"
        className="d-block w-100"
        style={{ height: "450px", objectFit: "cover" }}
        alt="Shoes"
      />
      <div className="carousel-caption d-none d-md-block">
        <h5>Third slide</h5>
        <p>For everyday wear.</p>
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


    </div>
	);
};
