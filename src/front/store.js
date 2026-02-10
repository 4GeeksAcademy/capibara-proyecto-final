export const initialStore = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  
  return {
    products: [],       // Data from GET /shoes
    token: token || null,     // JWT access_token from /login or localStorage
    user: user ? JSON.parse(user) : null,      // User info (email, id, plus profile) from localStorage
    profile: null,   // Profile data from /profile
    cart: [],        // Items added via /cart
    signup: false,   // Track signup status
    message: "",     // Optional messages
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {

    case "signup_success":
      return {
        ...store,
        signup: true,
      };

    case "signup_failed":
      return {
        ...store,
        signup: false,
      };

    case "login_success":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        ...store,
        user: action.payload.user,
        token: action.payload.token,
        user: action.payload.user,   // Store user info from backend
        profile: action.payload.user.profile || null, // Optional profile
      };

    case "logout":
      return {
        ...store,
        token: null,
        user: null,
        profile: null,
        cart: [],
      };
      case "logout":
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return {
          ...store,
          user: null,
          token: null,
        };

        case "update_user": {
        const updatedUser = { ...(store.user || {}), ...(action.payload || {}) };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        return {
        ...store,
        user: updatedUser,
      };
    }

    case "set_message":
      return {
        ...store,
        message: action.payload,
      };

    case "load_products":
      return {
        ...store,
        products: action.payload,
      };

    case "add_to_cart":
      return {
        ...store,
        cart: [...store.cart, action.payload],
      };

    case "remove_from_cart":
      return {
        ...store,
        // Filtramos para quitar el producto que coincida con el ID
        // Nota: Si hay productos repetidos, esto podría borrar ambos. 
        // Para un proyecto real avanzado, usaríamos un ID único de carrito, 
        // pero para este nivel está bien así.
        cart: store.cart.filter((item) => item.id !== action.payload.id),
      };

    default:
      return store;
  }
}