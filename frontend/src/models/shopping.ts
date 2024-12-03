import {Types} from "mongoose";

// Enum for user activities
export enum UserActivityType {
  SEARCH = "SEARCH",
  VIEW_PRODUCT = "VIEW_PRODUCT",
  ADD_TO_CART = "ADD_TO_CART",
  ADD_TO_WISHLIST = "ADD_TO_WISHLIST",
}

// Interface for cart item
export interface CartItem {
  product: Types.ObjectId;
  quantity: number;
  additionalData?: Record<string, any>;
  addedAt: Date;
}

// Interface for wishlist item
export interface WishlistItem {
  product: Types.ObjectId;
  addedAt: Date;
}

// Interface for viewed product
export interface ViewedProduct {
  product: Types.ObjectId;
  viewedAt: Date;
}

// Interface for search history
export interface SearchHistory {
  keyword: string;
  timestamp: Date;
}

// Interface for user activity
export interface UserActivity {
  type: UserActivityType;
  details?: Record<string, any>;
  timestamp: Date;
}

// Main UserShopping interface
export interface UserShopping {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  cart: CartItem[];
  wishlist: WishlistItem[];
  viewedProducts: ViewedProduct[];
  searchHistory: SearchHistory[];
  userActivities: UserActivity[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional: Type guard for UserShopping
export function isUserShopping(obj: any): obj is UserShopping {
  return (
    obj &&
    Types.ObjectId.isValid(obj.user) &&
    Array.isArray(obj.cart) &&
    Array.isArray(obj.wishlist) &&
    Array.isArray(obj.viewedProducts) &&
    Array.isArray(obj.searchHistory) &&
    Array.isArray(obj.userActivities)
  );
}
