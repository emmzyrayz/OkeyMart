// src/middleware.ts
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {verifyAuth} from "@/lib/auth/auth";

export async function middleware(request: NextRequest) {
  // Check if this is an API route
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        {message: "Unauthorized - No token provided"},
        {status: 401}
      );
    }

    const verifiedToken = await verifyAuth(token);

    if (!verifiedToken) {
      return NextResponse.json(
        {message: "Unauthorized - Invalid token"},
        {status: 401}
      );
    }

    // Add user info to headers for route handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("X-User-Id", verifiedToken.userId);
    requestHeaders.set("X-User-Role", verifiedToken.role);
    requestHeaders.set("X-User-Email", verifiedToken.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};