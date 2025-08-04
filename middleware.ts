import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.AUTH_SECRET });
	const { pathname } = req.nextUrl;

	// Unauthenticated and trying to access protected route
	const isProtectedRoute =
		pathname.startsWith("/system") ||
		pathname.startsWith("/agent") ||
		pathname.startsWith("/userprofile");

	if (!token && isProtectedRoute) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// ADMIN-only paths (system group)
	if (pathname.startsWith("/system") && token?.role !== "ADMIN") {
		return NextResponse.redirect(new URL("/unauthorized", req.url));
	}

	// Agent-only paths
	if (pathname.startsWith("/agent") && token?.role !== "AGENT") {
		return NextResponse.redirect(new URL("/unauthorized", req.url));
	}

	// User-only path
	if (pathname.startsWith("/userprofile") && token?.role !== "USER") {
		return NextResponse.redirect(new URL("/unauthorized", req.url));
	}

	return NextResponse.next();
}

// next.config.js
export const config = {
	// Enable middleware only for these paths
	matcher: ["/system/:path*", "/agent/:path*", "/userprofile/:path*"],
};
