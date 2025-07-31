import { createContext, useContext, useReducer, useEffect } from 'react';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  [key: string]: any;
}

interface CartState extends Array<CartItem & { quantity: number }> {}

// Definimos la interfaz del contexto
interface CartContextType {
  cart: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// ✅ CORRECCIÓN: Proporcionamos un valor predeterminado con la estructura correcta
const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => { throw new Error(' addToCart not implemented'); },
  removeFromCart: () => { throw new Error('removeFromCart not implemented'); },
  updateQuantity: () => { throw new Error('updateQuantity not implemented'); },
  clearCart: () => { throw new Error('clearCart not implemented'); },
  totalItems: 0,
  totalPrice: 0
});


// Clave única para localStorage
const CART_STORAGE_KEY = 'nextjs_shopping_cart';

const cartReducer = (state:any, action:any) => {
  switch (action.type) {
    case 'INIT':
      return action.payload;
    case 'ADD_ITEM':
      const existingItem = state.find((item:any) => item?.id === action?.item?.id);
      if (existingItem) {
        return state.map((item:any) =>
          item.id === action?.item?.id
            ? { ...item, quantity: item?.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action?.item, quantity: 1 }];
    case 'REMOVE_ITEM':
      return state.filter((item:any) => item?.id !== action?.id);
    case 'UPDATE_QUANTITY':
      return state.map((item:any) =>
        item.id === action.id 
          ? { ...item, quantity: Math.max(1, action.quantity) } 
          : item
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }:{children:any}) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    // Inicialización segura para SSR
    if (typeof window !== 'undefined') {
      try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        return storedCart ? JSON.parse(storedCart) : [];
      } catch (e) {
        console.error('Error loading cart', e);
      }
    }
    return [];
  });

  // Persistir cambios en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [cart]);

  // Funciones del carrito
  const addToCart = (item:any) => dispatch({ type: 'ADD_ITEM', item });
  
  const removeFromCart = (id: string | number) => dispatch({ type: 'REMOVE_ITEM', id });
  
  const updateQuantity = (id: string | number, quantity: any) => 
    quantity <= 0 
      ? removeFromCart(id) 
      : dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems: cart.reduce((sum:any, item:any) => sum + item.quantity, 0),
    totalPrice: cart.reduce((sum:any, item:any) => sum + (item?.price * item?.quantity), 0)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);