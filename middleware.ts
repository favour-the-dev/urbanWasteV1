import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow public files and api
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes("static")) {
    return NextResponse.next();
  }

  const tokenCookie = req.cookies.get("next-auth.session-token") || req.cookies.get("__Secure-next-auth.session-token");
  const token = tokenCookie ? String(tokenCookie.value || tokenCookie) : null;
  const payload = token ? verifyToken(token) : null;

  const role = payload?.role as string | undefined;

  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
  }

  if (pathname.startsWith("/operator")) {
    if (role !== "operator") {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/operator/:path*"],
};
