export const initialStore = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  return {
    products: [],
    token: token || null,
    user: user ? JSON.parse(user) : null,
    cart: [],
    signup: false,
    message: "",
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

    case "login_success": {
      const { token, user } = action.payload;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return {
        ...store,
        token,
        user,
      };
    }

    case "update_user": {
      const updatedUser = {
        ...(store.user || {}),
        ...(action.payload || {}),
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      return {
        ...store,
        user: updatedUser,
      };
    }

    case "logout":
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return {
        ...store,
        token: null,
        user: null,
        cart: [],
      };

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
        cart: store.cart.filter(
          (item) => item.id !== action.payload.id
        ),
      };

      case "admin_add_product":
        return {
          ...store,
          products: [...store.products, action.payload],
        };
      
      case "admin_delete_product": {
        const idToDelete = action.payload.id;
        return {
          ...store,
          products: store.products.filter((p)  => p.id !== idToDelete),
        };
      }

      case "admin_update_product": {
        const updatedProduct = action.payload;
        return {
          ...store,
          products: store.products.map((p) => p.id === updatedProduct.id ? updatedProduct : p),
        }
      };
      

    default:
      return store;
  }
}
