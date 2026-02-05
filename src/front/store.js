export const initialStore = () => {
  return {
    message: null,
    // DATOS DE PRUEBA (MOCK DATA)
    
    products: [
      {
        id: 1,
        name: "Nike Air Max",
        price: 120,
        description: "Comodidad y estilo para correr largas distancias.",
        image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: 2,
        name: "Adidas Ultraboost",
        price: 140,
        description: "Energía sin fin para tus pies en cada paso.",
        image_url: "https://assets.adidas.com/images/w_600,f_auto,q_auto/f9d5281c107c484fb341aefc00f3426e_9366/Ultraboost_22_Shoes_Black_GX3060_01_standard.jpg"
      },
      {
        id: 3,
        name: "Puma RS-X",
        price: 110,
        description: "Estilo retro reimaginado con colores vibrantes.",
        image_url: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/391174/01/sv01/fnd/EEA/fmt/png/Zapatillas-RS-X-Efekt-Turbo"
      },
      {
        id: 4,
        name: "New Balance 574",
        price: 90,
        description: "El clásico más versátil para uso diario.",
        image_url: "https://nb.scene7.com/is/image/NB/u574lgvb_nb_02_i?$pdpflexf2$"
      }
    ],
    cart: [],
    user: null,
    token: null,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "login_success":
      return {
        ...store,
        user: action.payload.user,
        token: action.payload.token,
        user: action.payload.user,
      };

    case "set_hello":
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
        // Agregamos el nuevo producto al final del array existente
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
      throw Error("Unknown action.");
  }
}