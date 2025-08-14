// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	const token = await auth();

	if (!token && pathname !== "/login") {
		return NextResponse.redirect(new URL("/login", req.url));
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
		"/user/application/:path*",
	],
};
