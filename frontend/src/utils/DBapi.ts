// utils/DBapi.ts

import {NextApiResponse} from "next";
import mongoose from "mongoose";
import {AuthenticatedRequest} from "@/types/middleware";

// Enum for database error codes
export enum DBErrorCode {
  CONNECTION_FAILED = "DB_CONNECTION_FAILED",
  CONNECTION_LOST = "DB_CONNECTION_LOST",
  TIMEOUT = "DB_TIMEOUT",
  UNKNOWN = "DB_UNKNOWN_ERROR",
}

// Interface for database error response
interface DBErrorResponse {
  error: boolean;
  message: string;
  code: DBErrorCode;
  details?: any;
}

export function withDB(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Log incoming request
      console.log("Database Middleware Request:", {
        method: req.method,
        url: req.url,
        connectionState: mongoose.connection.readyState,
      });

      // Check MongoDB connection state
      if (mongoose.connection.readyState !== 1) {
        // Not connected (0 = disconnected, 2 = connecting, 3 = disconnecting)
        const errorResponse: DBErrorResponse = {
          error: true,
          message: "Database connection not established",
          code: DBErrorCode.CONNECTION_FAILED,
        };

        // If connecting, give it a short time to complete
        if (mongoose.connection.readyState === 2) {
          try {
            await new Promise((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error("Connection timeout"));
              }, 5000); // 5 second timeout

              mongoose.connection.once("connected", () => {
                clearTimeout(timeout);
                resolve(true);
              });
            });
          } catch (error) {
            return res.status(503).json({
              ...errorResponse,
              code: DBErrorCode.TIMEOUT,
              message: "Database connection timeout",
            });
          }
        } else {
          // Try to reconnect
          try {
            await mongoose.connect(process.env.MONGODB_URI as string);
          } catch (error) {
            console.error("Database Connection Error:", error);
            return res.status(503).json(errorResponse);
          }
        }
      }

      // Monitor connection during request handling
      const disconnectHandler = () => {
        console.error("Database connection lost during request");
        return res.status(503).json({
          error: true,
          message: "Database connection lost during request",
          code: DBErrorCode.CONNECTION_LOST,
        });
      };

      mongoose.connection.on("disconnected", disconnectHandler);

      try {
        // Call the actual handler
        await handler(req, res);
      } finally {
        // Clean up event listener
        mongoose.connection.off("disconnected", disconnectHandler);
      }
    } catch (error) {
      console.error("Database Middleware Error:", {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : "UnknownError",
      });

      return res.status(503).json({
        error: true,
        message: "Database error occurred",
        code: DBErrorCode.UNKNOWN,
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
