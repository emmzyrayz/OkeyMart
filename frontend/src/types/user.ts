// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isAuthenticated: boolean;
}

export type UserRole = "buyer" | "seller" | "admin" | null;
