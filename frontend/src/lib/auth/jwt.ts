// src/lib/auth/jwt.ts
import jwt from "jsonwebtoken";
import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {NextRequest} from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const TOKEN_EXPIRY = "30m"; // 30 minutes

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (
  userId: string,
  email: string,
  role: string = "Buyer"
): string => {
  return jwt.sign({userId, email, role}, JWT_SECRET, {expiresIn: TOKEN_EXPIRY});
};

export const verifyToken = async (request: NextRequest) => {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {message: "No authentication token provided"},
        {status: 401}
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        {message: "Invalid authentication token"},
        {status: 401}
      );
    }
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
};
