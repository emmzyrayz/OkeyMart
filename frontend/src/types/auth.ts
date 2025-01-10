// src/types/auth.ts
export type Role = "admin" | "user" | "manager";

export interface AuthenticatedRequest {
  user: {
    userId: string;
    role: Role;
    email: string;
  };
}

export interface TokenPayload {
  userId: string;
  role: Role;
  email: string;
  iat: number;
  exp: number;
}
