export const initialStore = () => {
  return {
    message: null,
    // 1. Array vacío donde cargaremos los zapatos desde tu API/Base de datos
    products: [], 
    // 2. Array vacío para ir guardando lo que el usuario quiere comprar
    cart: []      
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    // 3. ESTE ES NUEVO: Recibe la lista de zapatos desde la API y actualiza el store
    case 'load_products':
      return {
        ...store,
        products: action.payload // 'action.payload' será el array de zapatos que traigas del backend
      };

    // 4. ESTE ES NUEVO: Agrega un zapato específico al carrito
    case 'add_to_cart':
      return {
        ...store,
        // Creamos una copia del carrito actual y le agregamos el nuevo producto
        cart: [...store.cart, action.payload]
      };
      
    // 5. OPCIONAL: Para quitar cosas del carrito (por ahora busca por índice o ID)
    case 'remove_from_cart':
        return {
            ...store,
            cart: store.cart.filter((item) => item.id !== action.payload.id)
        };

    default:
      throw Error('Unknown action.');
  }    
}