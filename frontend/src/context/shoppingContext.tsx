"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {Types} from "mongoose";
import {Product} from "@/types/product";
import axios from "axios";
import {useUser} from "./userContext/UserContext";
import {
  UserShopping,
  CartItem as CartItems,
  UserActivityType,
  WishlistItem,
  ViewedProduct,
  SearchHistory,
  UserActivity as ServerUserActivity,
} from "@/types/usershopping";
import shoppingAuthApi, {handleShoppingApiError} from "@/utils/shoppingAuthApi";

// Helper function for getting product ID
const getProductId = (product: Product): string | null => {
  return product._id || product.id || null;
};

const isObjectId = (id: any): id is Types.ObjectId => {
  return id instanceof Types.ObjectId;
};

function isFullProduct(product: Types.ObjectId | Product): product is Product {
  return typeof product === "object" && "_id" in product;
}

// Generic additional data type that can accommodate different product types
export interface ProductAdditionalData {
  [key: string]: string | number | boolean;
}

// Extend Product to match server-side requirements
export interface CartItem extends Product {
  product?: Product | Types.ObjectId;
  productId?: string;
  quantity: number;
  additionalData?: Record<string, string | number | boolean>;
  addedAt?: Date;
}

// Mapping function to convert client-side types to server-side types
const mapToServerCartItem = (item: CartItem): CartItems => {
  // Ensure we have a product ID
  const productId =
    item._id ||
    (typeof item.product === "object" && "_id" in item.product
      ? (item.product as Product)._id
      : null);

  return {
    product: isObjectId(productId)
      ? productId
      : new Types.ObjectId(productId as string),
    productId: productId || "", // Ensure non-empty string
    quantity: item.quantity,
    additionalData: item.additionalData,
    addedAt: item.addedAt || new Date(),
    // Ensure name and price are always strings/numbers
    name: item.name || "", // Provide default empty string
    price: item.price || 0, // Provide default 0
  };
};

const mapToServerWishlistItem = (item: Product): WishlistItem => ({
  product: new Types.ObjectId(item._id),
  addedAt: new Date(),
});

const mapToServerViewedProduct = (item: Product): ViewedProduct => ({
  product: new Types.ObjectId(item._id),
  viewedAt: new Date(),
});

// New interfaces for search and activity logging
export interface SearchEntry {
  keyword: string;
  timestamp: number;
}

interface ShoppingState {
  cart: {
    items: CartItem[];
    total: number;
    itemCount: number;
  };
  wishlist: Product[];
  viewedProducts: Product[];
  searchHistory: SearchEntry[];
  recentSearchProducts: Product[];
  userActivities: UserActivity[];
}

type ShoppingAction =
  | {type: "ADD_TO_CART"; payload: CartItem}
  | {type: "REMOVE_FROM_CART"; payload: string}
  | {type: "UPDATE_QUANTITY"; payload: {id: string; quantity: number}}
  | {type: "CLEAR_CART"}
  | {type: "ADD_TO_WISHLIST"; payload: Product}
  | {type: "REMOVE_FROM_WISHLIST"; payload: string}
  | {type: "CLEAR_WISHLIST"}
  | {type: "ADD_VIEWED_PRODUCT"; payload: Product}
  | {type: "REMOVE_VIEWED_PRODUCT"; payload: string}
  | {type: "CLEAR_VIEWED_PRODUCTS"}
  | {type: "ADD_SEARCH_KEYWORD"; payload: string}
  | {type: "ADD_SEARCH_PRODUCTS"; payload: Product[]}
  | {type: "LOG_USER_ACTIVITY"; payload: UserActivity}
  | {
      type: "BULK_UPDATE";
      payload: {
        cart?: {items: CartItem[]; total: number; itemCount: number};
        wishlist?: Product[];
        viewedProducts?: Product[];
        searchHistory?: SearchEntry[];
        recentSearchProducts?: Product[];
        userActivities?: UserActivity[];
      };
    };

// Define a more flexible UserActivity to bridge client and server
interface UserActivity {
  type: UserActivityType;
  productId?: string;
  details?: Record<string, any>;
  timestamp: number;
}

interface ShoppingContextType {
  // Cart methods
  cartState: ShoppingState["cart"];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;

  // Wishlist methods
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;

  // Viewed Products methods
  viewedProducts: Product[];
  addToViewed: (product: Product) => void;
  removeFromViewlist: (productId: string) => void;
  clearViewedProducts: () => void;

  // Search methods
  searchHistory: SearchEntry[];
  recentSearchProducts: Product[];
  logSearch: (keyword: string, products?: Product[]) => void;

  // User Activity methods
  userActivities: UserActivity[];
  logUserActivity: (activity: UserActivity) => void;

  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}

interface UserInfo {
  id: string;
  email: string;
  isAuthenticated: boolean;
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(
  undefined
);

// Helper function to calculate cart total
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total: number, item: CartItem) => {
    const price = item.price * (1 - (item.discount || 0) / 100);
    return total + price * item.quantity;
  }, 0);
};

const shoppingReducer = (
  state: ShoppingState,
  action: ShoppingAction
): ShoppingState => {
  switch (action.type) {
    // Cart Actions
    case "ADD_TO_CART": {
      const existingItemIndex = state.cart.items.findIndex(
        (item) => getProductId(item) === getProductId(action.payload)
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        newItems = state.cart.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity + action.payload.quantity,
                additionalData: {
                  ...item.additionalData,
                  ...action.payload.additionalData,
                },
              }
            : item
        );
      } else {
        newItems = [...state.cart.items, action.payload];
      }

      const totalItems = newItems.reduce(
        (count: number, item: CartItem) => count + item.quantity,
        0
      );

      return {
        ...state,
        cart: {
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: totalItems,
        },
      };
    }

    case "REMOVE_FROM_CART": {
      const newItems = state.cart.items.filter(
        (item) => getProductId(item) !== action.payload
      );
      const totalItems = newItems.reduce(
        (count: number, item: CartItem) => count + item.quantity,
        0
      );
      return {
        ...state,
        cart: {
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: totalItems,
        },
      };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.cart.items.map((item) =>
        getProductId(item) === action.payload.id
          ? {...item, quantity: action.payload.quantity}
          : item
      );
      const totalItems = newItems.reduce(
        (count: number, item: CartItem) => count + item.quantity,
        0
      );
      return {
        ...state,
        cart: {
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: totalItems,
        },
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        cart: {
          items: [],
          total: 0,
          itemCount: 0,
        },
      };

    // Wishlist Actions
    case "ADD_TO_WISHLIST": {
      const productId = getProductId(action.payload);
      if (!productId) return state;

      if (state.wishlist.some((item) => getProductId(item) === productId)) {
        return state;
      }

      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };
    }

    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter(
          (item) => getProductId(item) !== action.payload
        ),
      };

    case "CLEAR_WISHLIST":
      return {
        ...state,
        wishlist: [],
      };

    // Viewed Products Actions
    case "ADD_VIEWED_PRODUCT": {
      const productId = getProductId(action.payload);
      if (!productId) return state;

      const updatedViewedProducts = state.viewedProducts.filter(
        (item) => getProductId(item) !== productId
      );
      const newViewedProducts = [
        action.payload,
        ...updatedViewedProducts,
      ].slice(0, 10); // Keep only last 10 viewed products

      return {
        ...state,
        viewedProducts: newViewedProducts,
      };
    }

    case "REMOVE_VIEWED_PRODUCT":
      return {
        ...state,
        viewedProducts: state.viewedProducts.filter(
          (item) => getProductId(item) !== action.payload
        ),
      };

    case "CLEAR_VIEWED_PRODUCTS":
      return {
        ...state,
        viewedProducts: [],
      };

    // Search Actions
    case "ADD_SEARCH_KEYWORD":
      return {
        ...state,
        searchHistory: [
          {keyword: action.payload, timestamp: Date.now()},
          ...state.searchHistory.slice(0, 20), // Keep last 20 search keywords
        ],
      };

    case "ADD_SEARCH_PRODUCTS":
      return {
        ...state,
        recentSearchProducts: action.payload,
      };

    // User Activity Logging
    case "LOG_USER_ACTIVITY":
      return {
        ...state,
        userActivities: [
          action.payload,
          ...state.userActivities.slice(0, 50), // Keep last 50 activities
        ],
      };

    case "BULK_UPDATE":
      return {
        ...state,
        cart: action.payload.cart ?? state.cart,
        wishlist: action.payload.wishlist ?? state.wishlist,
        viewedProducts: action.payload.viewedProducts ?? state.viewedProducts,
        searchHistory: action.payload.searchHistory ?? state.searchHistory,
        recentSearchProducts:
          action.payload.recentSearchProducts ?? state.recentSearchProducts,
        userActivities: action.payload.userActivities ?? state.userActivities,
      };

    default:
      return state;
  }
};

export const ShoppingProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const {user, setUser: setUserInUserContext} = useUser();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: user.id,
    email: user.email,
    isAuthenticated:
      user.isAuthenticated &&
      !!localStorage.getItem("token") &&
      !!localStorage.getItem("userId") &&
      !!localStorage.getItem("userEmail"),
  });

  const [shoppingState, dispatch] = useReducer(shoppingReducer, {
    cart: {
      items: [],
      total: 0,
      itemCount: 0,
    },
    wishlist: [],
    viewedProducts: [],
    searchHistory: [],
    recentSearchProducts: [],
    userActivities: [],
  });

  // Update userInfo when user context changes
  useEffect(() => {
    setUserInfo({
      id: user.id,
      email: user.email,
      isAuthenticated: user.isAuthenticated,
    });
  }, [user]);

  // Replace the existing syncShoppingContext method
  const syncShoppingContext = useCallback(async () => {
    if (!userInfo.isAuthenticated) return;

    try {
      // Use the new API method to fetch shopping context
      const response = await shoppingAuthApi.fetchShoppingContext();
      const userData = response.data;

      // Explicitly convert server types to client types
     const populatedCart = userData.cart.map((item: CartItems) => ({
       ...(item.product as Product),
       quantity: item.quantity,
       additionalData: item.additionalData,
       addedAt: item.addedAt,
       productId: item.productId || (item.product as Product)?._id || "", // Fallback to empty string if no ID
     }));

     dispatch({
       type: "BULK_UPDATE",
       payload: {
         cart: {
           items: populatedCart,
           total: calculateTotal(populatedCart),
           itemCount: populatedCart.reduce(
             (sum: number, item: CartItem) => sum + item.quantity,
             0
           ),
         },
         wishlist:
           userData.wishlist?.map(
             (item: WishlistItem) => item.product as Product
           ) || [],
         viewedProducts:
           userData.viewedProducts?.map(
             (item: ViewedProduct) => item.product as Product
           ) || [],
         searchHistory: userData.searchHistory.map((entry: SearchHistory) => ({
           keyword: entry.keyword,
           timestamp:
             entry.timestamp instanceof Date
               ? entry.timestamp.getTime()
               : entry.timestamp || Date.now(),
         })),

         userActivities: userData.userActivities.map(
           (activity: ServerUserActivity) => ({
             type: activity.type,
             productId: activity.productId,
             details: activity.details,
             timestamp:
               activity.timestamp instanceof Date
                 ? activity.timestamp.getTime()
                 : activity.timestamp || Date.now(),
           })
         ),
       },
     });
    } catch (error) {
      // Use the new error handling utility
      const handledError = handleShoppingApiError(error);
      console.error("Error syncing shopping context:", handledError);
    }
  }, [userInfo.isAuthenticated, userInfo.id]);

  // Replace the existing saveShoppingContextToServer method
 const saveShoppingContextToServer = useCallback(async () => {
   if (!userInfo.isAuthenticated === true) return;

   try {
     // Use the new API method to sync context
     await shoppingAuthApi.syncShoppingContext({
       cart: shoppingState.cart.items.map(mapToServerCartItem),
       wishlist: shoppingState.wishlist.map(mapToServerWishlistItem),
       viewedProducts: shoppingState.viewedProducts.map(
         mapToServerViewedProduct
       ),
       searchHistory: shoppingState.searchHistory.map((entry) => ({
         keyword: entry.keyword,
         timestamp: new Date(entry.timestamp),
       })),
       userActivities: shoppingState.userActivities.map((activity) => ({
         type: activity.type,
         productId: activity.productId,
         details: activity.details,
         timestamp: new Date(activity.timestamp),
       })),
     });
   } catch (error) {
     const handledError = handleShoppingApiError(error);
     console.error("Error saving shopping context to server:", handledError);
   }
 }, [
   userInfo.isAuthenticated,
   userInfo.id,
   userInfo.email,
   shoppingState,
  //  setUser,
 ]);

  // Enhanced Cart Methods with Server Sync
  const addToCart = useCallback(
    async (product: CartItem) => {
      // Use user from UserContext directly
      if (!userInfo.isAuthenticated === true) {
        console.warn("User not authenticated. Redirecting to signin.");
        //  window.location.href = "/signin";
        return;
      }

      // Retrieve user details from localStorage
      const userId = localStorage.getItem("userId");
      const userEmail = localStorage.getItem("userEmail");

      if (!userId || !userEmail) {
        console.warn("User details missing. Redirecting to signin.");
        window.location.href = "/signin";
        return;
      }

      try {
        // Optimistically update local state
        dispatch({type: "ADD_TO_CART", payload: product});

        // Map to server-side cart item
        await shoppingAuthApi.addToCart({
          productId: product._id || "", // Ensure non-undefined string
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          image: product.images?.[0],
          additionalData: product.additionalData,
        });

        // Log user activity
        dispatch({
          type: "LOG_USER_ACTIVITY",
          payload: {
            type: "ADD_TO_CART",
            productId: getProductId(product) || "",
            details: {quantity: product.quantity},
            timestamp: Date.now(),
          },
        });
      } catch (error) {
        // Revert local state if server sync fails
        dispatch({
          type: "REMOVE_FROM_CART",
          payload: getProductId(product) || "",
        });

        // More robust error handling
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            // Clear all authentication-related local storage
            // localStorage.removeItem("token");
            // localStorage.removeItem("userId");
            // localStorage.removeItem("userEmail");
            // localStorage.removeItem("userData");

            // // Reset user context
            // setUser({
            //   id: "",
            //   email: "",
            //   isAuthenticated: false,
            //   name: "",
            //   role: "",
            // });

            // Redirect to signin
            // window.location.href = "/signin";
            return;
          }

          console.error("Detailed Axios Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          });
        } else {
          console.error("Unexpected Error:", error);
        }

        // Notify user of error
        // toast.error("Failed to add product to cart. Please try again.");

        console.error("Error adding to cart:", error);
      }
    },
    [userInfo.isAuthenticated, userInfo.id, userInfo.email,]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (!userInfo.isAuthenticated) {
        console.warn("User not authenticated. Cannot add to cart.");
        return;
      }

      // Find the product to be removed (for potential rollback)
      const removedProduct = shoppingState.cart.items.find(
        (item) => getProductId(item) === productId
      );

      // Optimistically remove from local state
      dispatch({type: "REMOVE_FROM_CART", payload: productId});

      try {
        // Attempt to sync removal with server using user ID and email
        // Use the specific method from shoppingAuthApi
        await shoppingAuthApi.removeFromCart(productId);
      } catch (error) {
        // Rollback if server sync fails
        if (removedProduct) {
          dispatch({type: "ADD_TO_CART", payload: removedProduct});
        }

        // toast.error("Failed to remove product from cart. Please try again.");
        console.error("Error removing from cart:", error);
      }
    },
    [
      userInfo.isAuthenticated,
      userInfo.id,
      userInfo.email,
      shoppingState.cart.items,
    ]
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({type: "UPDATE_QUANTITY", payload: {id: productId, quantity}});
  }, []);

  const clearCart = useCallback(() => {
    dispatch({type: "CLEAR_CART"});
  }, []);

  const isInCart = useCallback(
    (productId: string) => {
      return shoppingState.cart.items.some(
        (item) => getProductId(item) === productId
      );
    },
    [shoppingState.cart.items]
  );

  // Wishlist Methods
  const addToWishlist = useCallback(
    async (product: Product) => {
      // Check user authentication before proceeding
      if (!userInfo.isAuthenticated) {
        console.warn("User not authenticated. Cannot add to wishlist.");
        return;
      }

      // Check if product is already in wishlist
      const productId = product._id;
      if (!productId) return;

      // Prevent duplicate entries
      if (
        shoppingState.wishlist.some((wishlistItem) => {
          const itemProduct = wishlistItem;

          if (!itemProduct) {
            return false; // Skip items without a product
          }
          // Safely extract wishlist item's product ID
          const itemProductId =
            typeof itemProduct === "object" && "_id" in itemProduct
              ? itemProduct._id
              : itemProduct.toString();

          return itemProductId === productId;
        })
      ) {
        return;
      }

      try {
        console.log("Adding to Wishlist - Request Details:", {
          userId: userInfo.id,
          email: userInfo.email,
          productId: productId,
          isAuthenticated: userInfo.isAuthenticated,
        });

        // Optimistically add to local state
        dispatch({type: "ADD_TO_WISHLIST", payload: product});

        // Sync with server using user ID and email
        const response = await shoppingAuthApi.post(
          `/api/shopping/add-to-wishlist/${userInfo.id}`,
          {
            email: userInfo.email,
            product: {
              ...product,
              _id: productId, // Ensure _id is included
            },
          }
        );

        console.log("Wishlist Add Response:", response.data);

        // Log user activity
        dispatch({
          type: "LOG_USER_ACTIVITY",
          payload: {
            type: "ADD_TO_WISHLIST",
            productId,
            timestamp: Date.now(),
          },
        });
      } catch (error) {
        console.error("Detailed Wishlist Add Error:", {
          error,
          userId: userInfo.id,
          productId,
          isAxiosError: axios.isAxiosError(error),
          // responseData: error.response?.data,
          // responseStatus: error.response?.status,
        });

        // More detailed error handling
        if (axios.isAxiosError(error)) {
          console.error("Wishlist Add Error:", {
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
          });

          // Check for specific authentication errors
          if (error.response?.status === 401) {
            // Redirect to login or refresh token
            localStorage.removeItem("token");
            document.cookie =
              "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/signin";
          }
        }

        // Revert local state if server sync fails
        dispatch({
          type: "REMOVE_FROM_WISHLIST",
          payload: productId,
        });
      }
    },
    [
      userInfo.isAuthenticated,
      userInfo.id,
      userInfo.email,
      shoppingState.wishlist,
    ]
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      // Check user authentication before proceeding
      if (!userInfo.isAuthenticated) {
        console.warn("User not authenticated. Cannot remove from wishlist.");
        return;
      }

      // Find the product to be removed (for potential rollback)
      const removedProduct = shoppingState.wishlist.find(
        (item) => getProductId(item) === productId
      );

      // Optimistically remove from local state
      dispatch({type: "REMOVE_FROM_WISHLIST", payload: productId});

      try {
        // Attempt to sync removal with server using user ID and email
        await shoppingAuthApi.delete(
          `/api/shopping/remove-from-wishlist/${userInfo.id}/${productId}`,
          {
            data: {
              email: userInfo.email,
            },
          }
        );
      } catch (error) {
        // Rollback if server sync fails
        if (removedProduct) {
          dispatch({type: "ADD_TO_WISHLIST", payload: removedProduct});
        }

        // toast.error(
        //   "Failed to remove product from wishlist. Please try again."
        // );
        console.error("Error removing from wishlist:", error);
      }
    },
    [
      userInfo.isAuthenticated,
      userInfo.id,
      userInfo.email,
      shoppingState.wishlist,
    ]
  );

  const clearWishlist = useCallback(() => {
    dispatch({type: "CLEAR_WISHLIST"});
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => {
      return shoppingState.wishlist.some(
        (item) => getProductId(item) === productId
      );
    },
    [shoppingState.wishlist]
  );

  // Viewed Products Methods
  const addToViewed = useCallback(
    async (product: Product) => {
      // Check user authentication before proceeding
      if (!userInfo.isAuthenticated) {
        console.warn("User not authenticated. Cannot log viewed product.");
        return;
      }

      const productId = getProductId(product);
      if (!productId) return;

      // Optimistically add to local state
      dispatch({type: "ADD_VIEWED_PRODUCT", payload: product});

      try {
        // Sync with server using user ID and email
        await shoppingAuthApi.post(
          `/api/shopping/add-viewed-product/${userInfo.id}`,
          {
            email: userInfo.email,
            product,
          }
        );

        // Log user activity
        dispatch({
          type: "LOG_USER_ACTIVITY",
          payload: {
            type: "VIEW_PRODUCT",
            productId,
            timestamp: Date.now(),
          },
        });
      } catch (error) {
        // Potential silent failure or minimal handling for viewed products
        console.warn("Failed to log viewed product:", error);
      }
    },
    [userInfo.isAuthenticated, userInfo.id, userInfo.email]
  );

  const removeFromViewlist = useCallback((productId: string) => {
    dispatch({type: "REMOVE_VIEWED_PRODUCT", payload: productId});
  }, []);

  const clearViewedProducts = useCallback(() => {
    dispatch({type: "CLEAR_VIEWED_PRODUCTS"});
  }, []);

  const prepareCheckout = useCallback(async () => {
    try {
      // Validate cart
      if (shoppingState.cart.items.length === 0) {
        // toast.error("Your cart is empty");
        return null;
      }

      // Fetch latest product prices and availability
      const validatedCart = await shoppingAuthApi.post(
        "/api/checkout/validate-cart",
        {
          cartItems: shoppingState.cart.items,
        }
      );

      // Check for any price changes or unavailable items
      if (validatedCart.data.hasChanges) {
        // Update local cart with latest prices
        dispatch({
          type: "BULK_UPDATE",
          payload: {
            cart: {
              items: validatedCart.data.updatedItems,
              total: calculateTotal(validatedCart.data.updatedItems),
              itemCount: validatedCart.data.updatedItems.reduce(
                (count: number, item: CartItem) => count + item.quantity,
                0
              ),
            },
          },
        });

        // toast.warning("Some cart items have been updated");
        return null;
      }

      return validatedCart.data.checkoutToken;
    } catch (error) {
      // toast.error("Unable to prepare checkout. Please try again.");
      return null;
    }
  }, [shoppingState.cart.items]);

  const cartTotalWithDiscount = useMemo(() => {
    return calculateTotal(shoppingState.cart.items);
  }, [shoppingState.cart.items]);

  // Search Methods
  const logSearch = useCallback(
    (keyword: string, products?: Product[]) => {
      // Check user authentication before logging
      if (!userInfo.isAuthenticated) {
        console.warn("User not authenticated. Cannot log search.");
        return;
      }

      dispatch({type: "ADD_SEARCH_KEYWORD", payload: keyword});

      if (products) {
        dispatch({type: "ADD_SEARCH_PRODUCTS", payload: products});
      }

      // Log search activity
      dispatch({
        type: "LOG_USER_ACTIVITY",
        payload: {
          type: "SEARCH",
          details: {
            keyword,
            userId: userInfo.id,
            email: userInfo.email,
          },
          timestamp: Date.now(),
        },
      });

      // Optional: Send search to server
      try {
        shoppingAuthApi.post(`/api/shopping/log-search/${userInfo.id}`, {
          email: userInfo.email,
          keyword,
          products,
        });
      } catch (error) {
        console.warn("Failed to log search to server:", error);
      }
    },
    [userInfo.isAuthenticated, userInfo.id, userInfo.email]
  );

  // User Activity Logging Method
  const logUserActivity = useCallback((activity: UserActivity) => {
    // Local logging
    dispatch({type: "LOG_USER_ACTIVITY", payload: activity});

    // Optional: Send to analytics service
    try {
      // analyticsService.track(activity);
    } catch (error) {
      console.warn("Failed to log analytics:", error);
    }
  }, []);

  const handleShoppingContextLogout = useCallback(() => {
    // Clear local shopping state
    dispatch({type: "CLEAR_CART"});
    dispatch({type: "CLEAR_WISHLIST"});
    dispatch({type: "CLEAR_VIEWED_PRODUCTS"});
    // dispatch({type: "CLEAR_SEARCH_HISTORY"});

    // Reset user info
    setUserInfo({
      id: "",
      email: "",
      isAuthenticated: false,
    });
  }, []);

  // const saveShoppingContextToServer = async () => {
  //   try {
  //     await shoppingAuthApi.post("/api/shopping/update-context", {
  //       cart: shoppingState.cart.items,
  //       wishlist: shoppingState.wishlist,
  //       viewedProducts: shoppingState.viewedProducts,
  //       searchHistory: shoppingState.searchHistory,
  //       userActivities: shoppingState.userActivities,
  //     });
  //   } catch (error) {
  //     console.error("Error saving shopping context to server:", error);
  //   }
  // };

  // // Sync and save effects
  // useEffect(() => {
  //   // If user becomes unauthenticated, clear shopping context
  //   if (!user.isAuthenticated) {
  //     dispatch({type: "CLEAR_CART"});
  //     dispatch({type: "CLEAR_WISHLIST"});
  //     dispatch({type: "CLEAR_VIEWED_PRODUCTS"});
  //   } else {
  //     // Sync shopping context when user becomes authenticated
  //     syncShoppingContext();
  //   }
  // }, [user.isAuthenticated]);

  // useEffect(() => {
  //   if (userInfo.isAuthenticated) {
  //     // Periodic save
  //     const saveInterval = setInterval(
  //       saveShoppingContextToServer,
  //       5 * 60 * 1000
  //     );

  //     // Save before page unload
  //     const handleBeforeUnload = () => saveShoppingContextToServer();
  //     window.addEventListener("beforeunload", handleBeforeUnload);

  //     return () => {
  //       clearInterval(saveInterval);
  //       window.removeEventListener("beforeunload", handleBeforeUnload);
  //     };
  //   }
  // }, [userInfo.isAuthenticated, saveShoppingContextToServer]);

  // Create context value
  const contextValue = useMemo(
    () => ({
      // Cart
      cartState: shoppingState.cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,

      // Wishlist
      wishlist: shoppingState.wishlist,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      isInWishlist,

      // Viewed Products
      viewedProducts: shoppingState.viewedProducts,
      addToViewed,
      removeFromViewlist,
      clearViewedProducts,

      // Search
      searchHistory: shoppingState.searchHistory,
      recentSearchProducts: shoppingState.recentSearchProducts,
      logSearch,

      // User Activities
      userActivities: shoppingState.userActivities,
      logUserActivity,

      userInfo,
      setUserInfo,
    }),
    [
      shoppingState,
      userInfo,
      shoppingState,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      isInWishlist,
      addToViewed,
      removeFromViewlist,
      clearViewedProducts,
      logSearch,
      logUserActivity,
    ]
  );

  return (
    <ShoppingContext.Provider value={contextValue}>
      {children}
    </ShoppingContext.Provider>
  );
};

// Custom hook to use the shopping context
export const useShoppingContext = () => {
  const context = useContext(ShoppingContext);
  if (context === undefined) {
    throw new Error(
      "useShoppingContext must be used within a ShoppingProvider"
    );
  }
  return context;
};

// Utility functions for creating cart items
export const createCartItem = (
  product: Product,
  quantity: number,
  additionalData: ProductAdditionalData
): CartItem => {
  return {
    ...product,
    quantity,
    additionalData,
  };
};

// Revised helper functions with type-safe checks
export const createPhoneCartItem = (
  product: Product,
  quantity: number,
  color: string,
  ramSize: string,
  condition: string
) => {
  // Filter out undefined values
  const additionalData: ProductAdditionalData = {
    ...(color && {color}),
    ...(ramSize && {ramSize}),
    ...(condition && {condition}),
  };

  return createCartItem(product, quantity, additionalData);
};

export const createClothingCartItem = (
  product: Product,
  quantity: number,
  color?: string,
  size?: string,
  material?: string
) => {
  // Filter out undefined values
  const additionalData: ProductAdditionalData = {
    ...(color && {color}),
    ...(size && {size}),
    ...(material && {material}),
  };

  return createCartItem(product, quantity, additionalData);
};

// Example of safe additional data creation
export const safeCreateAdditionalData = (
  data: Record<string, string | number | boolean | undefined>
): ProductAdditionalData => {
  // Filter out undefined values
  return Object.entries(data)
    .filter(([_, value]) => value !== undefined)
    .reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as ProductAdditionalData);
};
