import {NextApiRequest, NextApiResponse} from "next";
import {IUser} from "@/models/user"; // Import your User model interface

export interface TokenData {
  token: string;
  expiryTime: number;
  lastActivity: number;
}

export interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
  status: string;
  tokenData: {
    issuedAt: Date;
    expiresAt: Date;
  };
}

export interface AuthenticatedRequest extends NextApiRequest {
  user?: AuthUser;
}

export type NextApiHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void> | void;

export type AuthMiddleware = (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) => Promise<void>;

export enum AuthErrorCode {
  TOKEN_MISSING = "TOKEN_MISSING",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_INVALID = "TOKEN_INVALID",
  TOKEN_REVOKED = "TOKEN_REVOKED",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  ACCOUNT_SUSPENDED = "ACCOUNT_SUSPENDED",
  ACCOUNT_BANNED = "ACCOUNT_BANNED",
  ACCOUNT_INVALID_STATUS = "ACCOUNT_INVALID_STATUS",
  ACCOUNT_DISABLED = "ACCOUNT_DISABLED",
  ROLE_MISSING = "ROLE_MISSING",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
}
