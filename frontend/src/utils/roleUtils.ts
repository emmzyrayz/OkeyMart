// utils/roleUtils.ts
import {UserRole} from "@/types/user";

// Define all possible permissions as a union type
export type Permission =
  | "view_products"
  | "add_to_cart"
  | "view_orders"
  | "manage_wishlist"
  | "manage_products"
  | "manage_store"
  | "manage_users"
  | "manage_roles";

// Define role permissions for non-null roles only
export const ROLE_PERMISSIONS: Record<Exclude<UserRole, null>, Permission[]> = {
  buyer: ["view_products", "add_to_cart", "view_orders", "manage_wishlist"],
  seller: ["view_products", "manage_products", "view_orders", "manage_store"],
  admin: ["view_products", "manage_products", "manage_users", "manage_roles"],
} as const;

// Type-safe permission check function
export const hasPermission = (
  userRole: UserRole,
  permission: Permission
): boolean => {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};
