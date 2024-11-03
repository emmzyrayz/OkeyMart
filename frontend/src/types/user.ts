// types/auth.ts
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isAuthenticated: boolean;
}

export type UserRole = "buyer" | "seller" | "admin" | null;
