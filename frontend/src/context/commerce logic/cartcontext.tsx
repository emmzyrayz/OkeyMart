"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import {Product} from "@/types/product";
import {shoppingAuthApi, handleShoppingApiError, mapServerCartItemToClientCartItem, ServerCartItem} from "@/utils/shoppingAuthApi";

// Helper function for getting product ID
const getProductId = (product: Product): string | null => {
  return product._id || product.id || null;
};

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string; // Added selectedColor
  selectedSize?: string; // Added selectedSize
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | {type: "SET_CART"; payload: CartItem[]}
  | {type: "ADD_TO_CART"; payload: CartItem}
  | {type: "REMOVE_FROM_CART"; payload: string}
  | {type: "UPDATE_QUANTITY"; payload: {id: string; quantity: number}}
  | {type: "CLEAR_CART"}
  | {type: "SET_LOADING"; payload: boolean}
  | {type: "SET_ERROR"; payload: string | null};

interface CartContextType {
  cartState: CartState;
  addToCart: (product: CartItem) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
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
    case "SET_CART":
      return {
        ...state,
        items: action.payload,
        total: calculateTotal(action.payload),
        itemCount: action.payload.reduce(
          (count, item) => count + item.quantity,
          0
        ),
        isLoading: false,
        error: null,
      };

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
        isLoading: false,
        error: null,
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
        isLoading: false,
        error: null,
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
        isLoading: false,
        error: null,
      };
    }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
        isLoading: false,
        error: null,
      };

    case "SET_LOADING":
      return {...state, isLoading: action.payload};

    case "SET_ERROR":
      return {...state, error: action.payload, isLoading: false};

    default:
      return state;
  }
};

export const CartProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [cartState, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: true,
    error: null,
  });

  // Add comprehensive logging
  useEffect(() => {
    console.group("Cart State Update");
    console.log("Current Cart State:", cartState);
    console.groupEnd();
  }, [cartState]);

  // Fetch cart on initial load
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      dispatch({type: "SET_LOADING", payload: true});
      const response = await shoppingAuthApi.getCart();

      console.log("Fetched Cart Response:", response.data);

      // Convert server cart items to local cart item format
      const cartItems: CartItem[] = response.data.cart.map((item: any) => {
        console.log("Raw Cart Item:", item);
        return {
          ...item,
          _id: item.productId,
          id: item.productId,
          selectedColor: item.additionalData?.selectedColor || "",
          selectedSize: item.additionalData?.selectedSize || "",
        };
      });

      dispatch({type: "SET_CART", payload: cartItems});
    } catch (err) {
      console.error("Fetch Cart Error:", err);
      const errorResult = handleShoppingApiError(err);
      dispatch({type: "SET_ERROR", payload: errorResult.error});
    }
  };

  const addToCart = useCallback(async (product: CartItem) => {
    try {
      dispatch({type: "SET_LOADING", payload: true});

      const productId = product._id || product.id;
      // Retrieve user data from localStorage
      const userData = localStorage.getItem("userData");
      if (!userData) {
        throw new Error("User not authenticated");
      }

      const user = JSON.parse(userData);
      const {id: userId, email} = user;

      // Comprehensive pre-submission validation
      const validationErrors = [];
      if (!product) validationErrors.push("Invalid product");
      if (!productId) validationErrors.push("Product ID is required");
      if (!product.name) validationErrors.push("Product name is required");
      if (!product.price) validationErrors.push("Product price is required");

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }

      // Prepare item for server
      const serverCartItem: ServerCartItem = {
        productId: product._id || product.id || "",
        name: product.name,
        price: product.price,
        quantity: product.quantity || 1,
        image: product.images?.[0], // Assuming images is an array
        additionalData: {
          selectedColor: product.selectedColor || "",
          selectedSize: product.selectedSize || "",
          userId,
          email,
        },
      };
      // First, attempt to create a shopping token if not exists
      try {
        await shoppingAuthApi.createShoppingToken({
          userId,
          email,
        });
      } catch (tokenError) {
        console.warn(
          "Token creation might have failed (possibly already exists)"
        );
      }

      console.log("Adding to Cart:", serverCartItem);

      const response = await shoppingAuthApi.addToCart(serverCartItem);

      // console.log("Add to Cart Response:", response.data);

      // Update type handling for response
      const cartItems = (response as any).cart.map(
        mapServerCartItemToClientCartItem
      );

      dispatch({type: "SET_CART", payload: cartItems});
    } catch (err) {
     console.error("Add to Cart Error:", err);
     const errorResult = handleShoppingApiError(err);

     // More granular error handling
     dispatch({
       type: "SET_ERROR",
       payload: errorResult.error || "Failed to add item to cart",
     });
    }
  }, []);

  const removeFromCart = useCallback(async (productId: string) => {
    try {
      dispatch({type: "SET_LOADING", payload: true});
      const response = await shoppingAuthApi.removeFromCart(productId);

      // Convert server response back to local format
      const cartItems: CartItem[] = response.data.cart.map((item: any) => ({
        ...item,
        _id: item.productId,
        id: item.productId,
        selectedColor: item.additionalData?.selectedColor || "",
        selectedSize: item.additionalData?.selectedSize || "",
      }));

      dispatch({type: "SET_CART", payload: cartItems});
    } catch (err) {
      const errorResult = handleShoppingApiError(err);
      dispatch({type: "SET_ERROR", payload: errorResult.error});
    }
  }, []);

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      try {
        dispatch({type: "SET_LOADING", payload: true});
        const response = await shoppingAuthApi.updateCartItemQuantity(
          productId,
          quantity
        );

        // Convert server response back to local format
        const cartItems: CartItem[] = response.data.cart.map((item: any) => ({
          ...item,
          _id: item.productId,
          id: item.productId,
          selectedColor: item.additionalData?.selectedColor || "",
          selectedSize: item.additionalData?.selectedSize || "",
        }));

        dispatch({type: "SET_CART", payload: cartItems});
      } catch (err) {
        const errorResult = handleShoppingApiError(err);
        dispatch({type: "SET_ERROR", payload: errorResult.error});
      }
    },
    []
  );

  const clearCart = useCallback(async () => {
    try {
      dispatch({type: "SET_LOADING", payload: true});
      await shoppingAuthApi.clearCart();
      dispatch({type: "CLEAR_CART"});
    } catch (err) {
      const errorResult = handleShoppingApiError(err);
      dispatch({type: "SET_ERROR", payload: errorResult.error});
    }
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