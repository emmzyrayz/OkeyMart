// utils/shoppingAuthApi.ts
import axios, {AxiosError, AxiosResponse} from "axios";
import {Product} from "@/types/product";
// import { CartItem } from '../context/commerce logic/cartcontext';
import {
  // CartItem,
  WishlistItem,
  ViewedProduct,
  SearchHistory,
  UserActivity,
  UserActivityType,
  UserShopping,
} from "@/types/usershopping";

// Define interfaces for your data structures
export interface CartItem {
  // product?: Types.ObjectId | Product;
  productId: string; // Make it required and always a string
  _id?: string;
  id?: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  additionalData?: Record<string, any>;
  addedAt?: Date;
  name: string;
  price: number;
}


export interface ServerCartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  additionalData?: {
    selectedColor?: string;
    selectedSize?: string;
    userId?: string;
    email?: string;
    [key: string]: any;
  };
}

interface TokenData {
  userId: string;
  email: string;
}

interface SearchData {
  keyword: string;
  products?: Product[];
}

interface ContextData {
  cart?: CartItem[];
  wishlist?: Product[];
  // Add other context-related fields
}

// Create a dedicated Axios instance for shopping service
const shoppingAxiosInstance = axios.create({
  baseURL: "https://okeymart-shopservice.onrender.com/api/shopping",
  headers: {
    "Content-Type": "application/json",
  },
});

// Mapping function for consistent conversion
export const mapServerCartItemToClientCartItem = (
  serverItem: ServerCartItem
): CartItem => ({
  ...serverItem,
  _id: serverItem.productId,
  id: serverItem.productId,
  selectedColor: serverItem.additionalData?.selectedColor || "",
  selectedSize: serverItem.additionalData?.selectedSize || "",
  discount: 0, // Default if not provided
  images: serverItem.image ? [serverItem.image] : [], // Ensure images is an array
});

// Request Interceptor for Authentication
shoppingAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      const user = JSON.parse(userData);

      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["x-user-id"] = user.id;
      config.headers["x-user-email"] = user.email;
    } else {
      // If no token is found, redirect to login
      window.location.href = "/signin";
      return Promise.reject(new Error("No authentication token found"));
    }

    console.group("API Request");
    console.log("URL:", config.url);
    console.log("Method:", config.method);
    console.log("Headers:", config.headers);
    console.log("Data:", config.data);
    console.groupEnd();
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Error Handling
shoppingAxiosInstance.interceptors.response.use(
  (response) => {
    console.group("API Response");
    console.log("URL:", response.config.url);
    console.log("Status:", response.status);
    console.log("Data:", response.data);
    console.groupEnd();
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.warn("Unauthorized: Redirecting to login");
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("userEmail");
          window.location.href = "/signin";
          break;

        case 403:
          console.error("Forbidden: Insufficient permissions");
          break;

        case 404:
          console.warn("Resource not found");
          break;

        case 500:
          console.error("Server error occurred");
          break;
      }
    }
    return Promise.reject(error);
  }
);

// Shopping-specific API methods
class ShoppingAuthApi {
  // Add more robust error handling
  private async handleApiCall<T>(
    apiCall: () => Promise<AxiosResponse<T>>
  ): Promise<T> {
    try {
      const response = await apiCall();
      return response.data;
    } catch (error) {
      const processedError = handleShoppingApiError(error);
      throw new Error(processedError.error);
    }
  }
  // Cart Operations
  async addToCart(cartItem: ServerCartItem): Promise<UserShopping> {
    return this.handleApiCall(() =>
      shoppingAxiosInstance.post("/cart/add", cartItem)
    );
  }

  async removeFromCart(productId: string): Promise<AxiosResponse> {
    return shoppingAxiosInstance.delete(`/cart/remove/${productId}`);
  }

  updateCartItemQuantity(
    productId: string,
    quantity: number
  ): Promise<AxiosResponse> {
    return shoppingAxiosInstance.patch(`/cart/update-quantity/${productId}`, {
      quantity,
    });
  }

  getCart(): Promise<AxiosResponse> {
    return shoppingAxiosInstance.get("/cart");
  }

  clearCart(): Promise<AxiosResponse> {
    return shoppingAxiosInstance.delete("/cart/clear");
  }

  bulkAddToCart(items: CartItem[]): Promise<AxiosResponse> {
    return shoppingAxiosInstance.post("/cart/bulk-add", {items});
  }

  // Wishlist Operations
  addToWishlist(product: Product): Promise<AxiosResponse> {
    return shoppingAxiosInstance.post("/wishlist/add", product);
  }

  removeFromWishlist(productId: string): Promise<AxiosResponse> {
    return shoppingAxiosInstance.delete(`/wishlist/remove/${productId}`);
  }

  getWishlist(): Promise<AxiosResponse> {
    return shoppingAxiosInstance.get("/wishlist");
  }

  // Viewed Products
  addViewedProduct(product: Product): Promise<AxiosResponse> {
    return shoppingAxiosInstance.post("/viewed-products/add", product);
  }

  getViewedProducts(): Promise<AxiosResponse> {
    return shoppingAxiosInstance.get("/viewed-products");
  }

  // Search & Activity Logging
  logSearch(searchData: SearchData): Promise<AxiosResponse> {
    return shoppingAxiosInstance.post("/search/log", searchData);
  }

  getUserActivities(): Promise<AxiosResponse> {
    return shoppingAxiosInstance.get("/activities");
  }

  // Token Management
  createShoppingToken(tokenData: TokenData): Promise<AxiosResponse> {
    return shoppingAxiosInstance.post("/tokens/create", tokenData);
  }

  validateShoppingToken(tokenData: TokenData): Promise<AxiosResponse> {
    return shoppingAxiosInstance.post("/tokens/validate", tokenData);
  }

  // Context Sync
  syncShoppingContext(contextData: {
    cart?: CartItem[];
    wishlist?: WishlistItem[];
    viewedProducts?: ViewedProduct[];
    searchHistory?: {keyword: string; timestamp: Date}[];
    userActivities?: {
      type: UserActivityType;
      productId?: string;
      details?: Record<string, any>;
      timestamp: Date;
    }[];
  }): Promise<AxiosResponse> {
    return shoppingAxiosInstance.post("/context/sync", contextData);
  }

  fetchShoppingContext(): Promise<AxiosResponse> {
    return shoppingAxiosInstance.get("/context");
  }

  post(url: string, data: any): Promise<AxiosResponse> {
    return shoppingAxiosInstance.post(url, data);
  }

  delete(url: string, config?: any): Promise<AxiosResponse> {
    return shoppingAxiosInstance.delete(url, config);
  }
}

// Create and export an instance
export const shoppingAuthApi = new ShoppingAuthApi();


// Error handling utility
export const handleShoppingApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    console.group("Shopping API Error");
    console.error("Full Error:", error);
    console.log("Response:", axiosError.response);
    console.log("Request:", axiosError.request);
    console.log("Config:", axiosError.config);
    console.groupEnd();

    const errorMessage =
      (axiosError.response?.data as any)?.message ||
      axiosError.message ||
      "An unexpected error occurred";

    console.error("Shopping API Error:", {
      message: errorMessage,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
    });

    return {
      success: false,
      error: errorMessage,
      status: axiosError.response?.status,
    };
  }

  return {
    success: false,
    error: "Network error or unexpected issue",
  };
};

export default shoppingAuthApi;