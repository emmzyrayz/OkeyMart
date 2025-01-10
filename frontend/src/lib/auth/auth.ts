// src/lib/auth.ts
import {jwtVerify} from "jose";
import {Role} from "@/types/auth";

interface VerifiedToken {
  userId: string;
  role: Role;
  email: string;
  iat: number;
  exp: number;
}

export async function verifyAuth(token: string): Promise<VerifiedToken | null> {
  try {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(process.env.JWT_SECRET);

    const {payload} = await jwtVerify(token, secretKey);

    return payload as unknown as VerifiedToken;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

// Middleware helper for role checking
export function checkRole(allowedRoles: Role[], userRole: Role): boolean {
  return allowedRoles.includes(userRole);
}
