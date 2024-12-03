import {Types} from "mongoose";
import {Product} from "./product";

export interface CartItem {
  product?: Types.ObjectId | Product;
  quantity: number;
  additionalData?: Record<string, string | number | boolean>;
  addedAt?: Date;
}

export interface WishlistItem {
  product?: Types.ObjectId | Product;
  addedAt?: Date;
}

export interface ViewedProduct {
  product?: Types.ObjectId | Product;
  viewedAt?: Date;
}

export interface SearchHistory {
  keyword: string;
  timestamp?:  Date;
}

export interface UserActivity {
  type: UserActivityType;
  productId?: any;
  details?: Record<string, any>;
  timestamp: Date;
}

export interface UserShopping {
  user: Types.ObjectId;
  cart: CartItem[];
  wishlist: WishlistItem[];
  viewedProducts: ViewedProduct[];
  searchHistory: SearchHistory[];
  userActivities: UserActivity[];
}

export type UserActivityType =
  | "SEARCH"
  | "VIEW_PRODUCT"
  | "ADD_TO_CART"
  | "ADD_TO_WISHLIST";