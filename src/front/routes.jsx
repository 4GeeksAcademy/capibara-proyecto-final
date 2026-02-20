// Import necessary components and functions from react-router-dom.
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Login } from "./pages/Login";
import { Catalog } from "./pages/Catalog";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
// import {Profile} from "./pages/Profile";
import { AdminLogin } from "./pages/AdminLogin";
import { Shoes } from "./pages/Shoes";

import { Signup } from "./pages/Signup";
import { EditProfile } from "./pages/EditProfile";
import { Admin } from "./pages/Admin";
export const router = createBrowserRouter(
    createRoutesFromElements(
        // Root Route: All navigation will start from here.
        <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

            {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
            <Route path="/" element={<Home />} />

            {/* Ruta del Catálogo */}
            <Route path="/catalog" element={<Catalog />} />

            {/* Ruta del Carrito */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* He cambiado "/single/" por "/product/" para que coincida con el ProductCard */}
            <Route path="/product/:theId" element={<Single />} />

            <Route path="/login" element={<Login />} />


            {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/shoes" element={<Shoes />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="/admin" element={<Admin />} />
        </Route>
    )
);