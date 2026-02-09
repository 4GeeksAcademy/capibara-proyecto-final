export const initialStore = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  
  return {
    shoes: [],       // Data from GET /shoes
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
      return {
        ...store,
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

    case "update_user":
      return {
        ...store,
        user: action.payload.user ? action.payload.user : store.user,
        profile: action.payload.profile ? action.payload.profile : store.profile,
      };

    case "set_message":
      return {
        ...store,
        message: action.payload,
      };

    case "load_shoes":
      return {
        ...store,
        shoes: action.payload,
      };

    case "add_to_cart":
      return {
        ...store,
        cart: [...store.cart, action.payload],
      };

    case "remove_from_cart":
      return {
        ...store,
        cart: store.cart.filter((item) => item.id !== action.payload.id),
      };

    default:
      throw Error("Unknown action.");
  }
}
