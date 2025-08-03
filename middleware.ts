// File: middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    const { pathname } = req.nextUrl;

    console.log("MIDDLEWARE REQUEST:", {
        pathname,
        hasToken: !!token,
        role: token?.role,
        url: req.url
    });

    // If no token and needs login, redirect to login
    if (!token && pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Role-based access control
    if (token?.role) {
        // Admin routes
        if (pathname.startsWith("/system") && token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Agent routes
        if (pathname.startsWith("/agent/profile") && token.role !== "AGENT") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // User routes (allow USER and ADMIN for /user/profile and /agent/apply)
        if ((pathname.startsWith("/user/profile") || pathname.startsWith("/agent/apply")) 
            && token.role !== "USER" && token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/agent/profile/:path*',
        '/system/:path*',
        '/user/profile/:path*',
        '/agent/apply/:path*'
    ]
};
