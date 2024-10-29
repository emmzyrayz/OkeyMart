import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const {pathname} = request.nextUrl;

  if (!token && pathname !== "/signin" && pathname !== "/signup") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/dashboard", "/profile", "/settings", "/"],
};