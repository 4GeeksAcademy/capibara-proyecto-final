export const initialStore = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const profile = localStorage.getItem("profile");  // ✅ Add profile
  const cart = localStorage.getItem("cart");
  return {
    products: [],
    token: token || null,
    user: user ? JSON.parse(user) : null,
    profile: profile ? JSON.parse(profile) : null,  // ✅ Add profile to state
    cart: cart ? JSON.parse(cart) : [],
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

    case "login_success":
    case "SET_USER": {  // ✅ Handle both login and signup
      const { token, user, profile } = action.payload;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // ✅ Store profile if it exists
      if (profile) {
        localStorage.setItem("profile", JSON.stringify(profile));
      }

      return {
        ...store,
        token,
        user,
        profile: profile || store.profile,  // ✅ Keep existing profile if not provided
      };
    }

    case "update_user": {
      // ✅ Check if we're updating user or profile
      const isProfileUpdate = action.payload.first_name || action.payload.last_name;
      
      if (isProfileUpdate) {
        // Update profile
        const updatedProfile = {
          ...(store.profile || {}),
          ...(action.payload || {}),
        };
        
        localStorage.setItem("profile", JSON.stringify(updatedProfile));
        
        return {
          ...store,
          profile: updatedProfile,
        };
      } else {
        // Update user
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
    }

    case "logout":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("profile");  // ✅ Clear profile too

      return {
        ...store,
        token: null,
        user: null,
        profile: null,  // ✅ Clear profile
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
        cart: store.cart.filter((item) => item.id !== action.payload.id),
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
        products: store.products.filter((p) => p.id !== idToDelete),
      };
    }

    case "admin_update_product": {
      const updatedProduct = action.payload;
      return {
        ...store,
        products: store.products.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p,
        ),
      };
    }

    default:
      return store;
  }
}