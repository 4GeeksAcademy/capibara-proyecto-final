export const initialStore = () => {
  return {
    message: null,
    // Agregamos zapatos de prueba aquí para verlos en el catálogo
    products: [
      {
        id: 1,
        name: "Nike Air Max",
        price: 120,
        description: "Comodidad y estilo para correr.",
        image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: 2,
        name: "Adidas Ultraboost",
        price: 140,
        description: "Energía sin fin para tus pies.",
        image_url: "https://assets.adidas.com/images/w_600,f_auto,q_auto/f9d5281c107c484fb341aefc00f3426e_9366/Ultraboost_22_Shoes_Black_GX3060_01_standard.jpg"
      },
      {
        id: 3,
        name: "Puma RS-X",
        price: 110,
        description: "Estilo retro reimaginado.",
        image_url: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/391174/01/sv01/fnd/EEA/fmt/png/Zapatillas-RS-X-Efekt-Turbo"
      },
      {
        id: 4,
        name: "New Balance 574",
        price: 90,
        description: "El clásico más versátil.",
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
      };

    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    // Recibe la lista de zapatos desde la API y actualiza el store
    case "load_products":
      return {
        ...store,
        products: action.payload, // 'action.payload' será el array de zapatos desde el backend
      };

    // Agrega un zapato específico al carrito
    case "add_to_cart":
      return {
        ...store,
        // Copia del carrito actual y se le agrega el nuevo producto
        cart: [...store.cart, action.payload],
      };

    // Para quitar cosas del carrito (busca por ID)
    case "remove_from_cart":
      return {
        ...store,
        cart: store.cart.filter((item) => item.id !== action.payload.id),
      };

    default:
      throw Error("Unknown action.");
  }
}
