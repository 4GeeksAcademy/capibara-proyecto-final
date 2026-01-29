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
    }

    useEffect(() => {
    loadProducts()
  }, [])

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
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img 
  src="https://images.unsplash.com/photo-1565379793984-e65b51b33b37?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  className="d-block mx-auto img-fluid"
  style={{height: "450px", objectFit: "cover"}}
  alt="Converse shoes"
  />
      <div class="carousel-caption d-none d-md-block">
        <h5>First slide label</h5>
        <p>Some representative placeholder content for the first slide.</p>
      </div>
    </div>
    <div class="carousel-item">
      <img 
  src="https://images.unsplash.com/photo-1670181830393-877c92daa0e3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  className="d-block w-100"
  style={{height: "fixed", objectFit: "cover"}}
  alt="Converse shoes"
  />
      <div class="carousel-caption d-none d-md-block">
        <h5>Second slide label</h5>
        <p>Some representative placeholder content for the second slide.</p>
      </div>
    </div>
    <div class="carousel-item">
         <img 
  src="https://images.unsplash.com/photo-1670181830277-e6db6b34cc3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  className="d-block w-100"
  style={{height: "450px", objectFit: "cover"}}
  alt="Converse shoes"
  />
      <div class="carousel-caption d-none d-md-block">
        <h5>Third slide label</h5>
        <p>Some representative placeholder content for the third slide.</p>
      </div>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

    </div>
  );
};