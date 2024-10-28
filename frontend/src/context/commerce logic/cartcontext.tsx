"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";
import {Product} from "@/types/product";

// Helper function for getting product ID
const getProductId = (product: Product): string | null => {
  return product._id || product.id || null;
};

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string; // Added selectedColor
  selectedSize: string; // Added selectedSize
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | {type: "ADD_TO_CART"; payload: CartItem}
  | {type: "REMOVE_FROM_CART"; payload: string}
  | {type: "UPDATE_QUANTITY"; payload: {id: string; quantity: number}}
  | {type: "CLEAR_CART"};

interface CartContextType {
  cartState: CartState;
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const price = item.price * (1 - (item.discount || 0) / 100);
    return total + price * item.quantity;
  }, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
     const existingItemIndex = state.items.findIndex(
       (item) => getProductId(item) === getProductId(action.payload)
     );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity + action.payload.quantity,
                selectedColor: action.payload.selectedColor,
                selectedSize: action.payload.selectedSize,
              }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }

      const totalItems = newItems.reduce(
        (count, item) => count + item.quantity,
        0
      );

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: totalItems,
      };
    }

    case "REMOVE_FROM_CART": {
      const newItems = state.items.filter(
        (item) => getProductId(item) !== action.payload
      );
      const totalItems = newItems.reduce(
        (count, item) => count + item.quantity,
        0
      );
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: totalItems,
      };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) =>
        getProductId(item) === action.payload.id
          ? {...item, quantity: action.payload.quantity}
          : item
      );
      const totalItems = newItems.reduce(
        (count, item) => count + item.quantity,
        0
      );
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: totalItems,
      };
    }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [cartState, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  const addToCart = useCallback((product: CartItem) => {
    dispatch({type: "ADD_TO_CART", payload: product});
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({type: "REMOVE_FROM_CART", payload: productId});
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({type: "UPDATE_QUANTITY", payload: {id: productId, quantity}});
  }, []);

  const clearCart = useCallback(() => {
    dispatch({type: "CLEAR_CART"});
  }, []);

  const isInCart = useCallback(
    (productId: string) => {
      return cartState.items.some((item) => getProductId(item) === productId);
    },
    [cartState.items]
  );

  return (
    <CartContext.Provider
      value={{
        cartState,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};