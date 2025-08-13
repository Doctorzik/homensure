// File: middleware.ts

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(req: NextRequest) {
	const token = await auth();
	const { pathname } = req.nextUrl;

	// If no token and needs login, redirect to login
	if (!token && pathname !== "/login") {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// Role-based access control
	if (token?.user.role) {
		// Admin routes
		if (pathname.startsWith("/system") && token.user.role !== "ADMIN") {
			return NextResponse.redirect(new URL("/unauthorized", req.url));
		}

		// Agent routes
		if (
			(pathname.startsWith("/user/agent/profile") ||
				pathname.startsWith("/user/agent/properties")) &&
			token.user.role !== "AGENT"
		) {
			return NextResponse.redirect(new URL("/unauthorized", req.url));
		}

		// User routes (allow USER and ADMIN for /user/profile and /user/agent/apply)
		if (
			(pathname.startsWith("/user/profile") ||
				pathname.startsWith("/user/agent/apply")) &&
			token.user.role !== "USER" &&
			token.user.role !== "ADMIN"
		) {
			return NextResponse.redirect(new URL("/unauthorized", req.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/user/agent/profile/:path*",
		"/user/agent/properties/:path*",
		"/system/:path*",
		"/user/profile/:path*",
		"/user/agent/apply/:path*",
		"/user/application:path*",
	],
};
