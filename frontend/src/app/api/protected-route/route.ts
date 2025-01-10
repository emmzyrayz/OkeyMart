// src/app/api/protected-route/route.ts
import {NextResponse} from "next/server";
import {headers} from "next/headers";
import {verifyAuth} from "@/lib/auth/auth";
import {Role} from "@/types/auth";

// Define allowed roles
const ALLOWED_ROLES: Role[] = ["admin"];

export async function GET() {
  try {
    const headersList = headers();
    const token = headersList.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        {message: "Unauthorized - No token provided"},
        {status: 401}
      );
    }

    // Verify auth and get user data
    const verifiedToken = await verifyAuth(token);

    if (!verifiedToken) {
      return NextResponse.json(
        {message: "Unauthorized - Invalid token"},
        {status: 401}
      );
    }

    // Check role
    if (!ALLOWED_ROLES.includes(verifiedToken.role)) {
      return NextResponse.json(
        {message: "Forbidden - Insufficient permissions"},
        {status: 403}
      );
    }

    // Your protected route logic here
    return NextResponse.json({
      message: "Protected route accessed successfully",
      user: {
        id: verifiedToken.userId,
        role: verifiedToken.role,
      },
    });
  } catch (error) {
    console.error("Protected route error:", error);
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}

// If you need POST, PUT, DELETE methods, add them here
export async function POST() {
  // Similar structure to GET but for POST operations
}
