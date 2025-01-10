import {NextApiResponse} from "next";
import {AuthenticatedRequest, AuthErrorCode, AuthUser} from "@/types/middleware";
import {tokenManager} from "@/utils/middle-utils";
import UserModel from "@/models/user";
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export async function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Log incoming request
      console.log("Auth Middleware Request:", {
        headers: req.headers,
        method: req.method,
        url: req.url,
      });

      // Extract token
      const authHeader = req.headers.authorization;
      const token = authHeader?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({
          error: true,
          message: "No token provided",
          code: AuthErrorCode.TOKEN_MISSING,
        });
      }

      // Verify token
      let decoded;
      try {
        decoded = tokenManager.verifyToken(token);
      } catch (err) {
        if (err instanceof TokenExpiredError) {
          return res.status(401).json({
            error: true,
            message: "Token has expired",
            code: AuthErrorCode.TOKEN_EXPIRED,
          });
        }
        if (err instanceof JsonWebTokenError) {
          return res.status(401).json({
            error: true,
            message: "Invalid token",
            code: AuthErrorCode.TOKEN_INVALID,
          });
        }
        throw err;
      }

      // Check active token
      const activeToken = tokenManager.getTokenData(decoded.userId);
      if (!activeToken || activeToken.token !== token) {
        return res.status(401).json({
          error: true,
          message: "Token has been revoked or replaced",
          code: AuthErrorCode.TOKEN_REVOKED,
        });
      }

      // Verify user
      const user = await UserModel.findById(decoded.userId).select(
        "role status email isActive"
      );

      if (!user) {
        return res.status(401).json({
          error: true,
          message: "User not found",
          code: AuthErrorCode.USER_NOT_FOUND,
        });
      }

      // Check user status
      switch (user.status) {
        case "active":
          break;
        case "suspended":
          return res.status(401).json({
            error: true,
            message: "Account is suspended",
            code: AuthErrorCode.ACCOUNT_SUSPENDED,
            details: {
              userId: user._id,
              suspendedAt: user.updatedAt
                ? user.updatedAt.toISOString()
                : new Date().toISOString(),
            },
          });
        case "banned":
          return res.status(401).json({
            error: true,
            message: "Account is banned",
            code: AuthErrorCode.ACCOUNT_BANNED,
          });
        default:
          return res.status(401).json({
            error: true,
            message: "Invalid account status",
            code: AuthErrorCode.ACCOUNT_INVALID_STATUS,
          });
      }

      // Update activity
      tokenManager.updateTokenActivity(decoded.userId);

      // Attach user to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: user.role,
        status: user.status,
        tokenData: {
          issuedAt: new Date(decoded.iat * 1000),
          expiresAt: new Date(decoded.exp * 1000),
        },
      };

      // Call the actual handler
      return handler(req, res);
    } catch (error) {
      console.error("Auth Middleware Error:", {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : "UnknownError",
      });

     return res.status(401).json({
       error: true,
       message: "Authentication failed",
       details:
         process.env.NODE_ENV !== "production"
           ? error instanceof Error
             ? error.message
             : "Unknown error occurred"
           : undefined,
     });
    }
  };
}

export function withRole(roles: string[]) {
  return (
    handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
  ) => {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
      if (!req.user || !req.user.role) {
        return res.status(403).json({
          error: true,
          message: "Access denied - Role information not available",
          code: AuthErrorCode.ROLE_MISSING,
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          error: true,
          message: "Access denied - Insufficient permissions",
          code: AuthErrorCode.INSUFFICIENT_PERMISSIONS,
          requiredRoles: roles,
          currentRole: req.user.role,
        });
      }

      return handler(req, res);
    };
  };
}
