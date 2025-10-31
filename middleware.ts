import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // allow public files and api
    if (
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname.includes("static")
    ) {
        return NextResponse.next();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const role = (token as any)?.role as string | undefined;

    if (pathname.startsWith("/admin")) {
        if (role !== "admin") {
            return NextResponse.redirect(new URL("/signin", req.url));
        }
    }

    if (pathname.startsWith("/operator")) {
        if (role !== "operator") {
            return NextResponse.redirect(new URL("/signin", req.url));
        }
    }

    if (pathname.startsWith("/citizen")) {
        if (role !== "citizen") {
            return NextResponse.redirect(new URL("/signin", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/operator/:path*", "/citizen/:path*"],
};
