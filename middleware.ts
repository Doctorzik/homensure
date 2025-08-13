// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	console.log(pathname);
	const token =
		req.cookies.get("next-auth.session-token") ||
		req.cookies.get("__Secure-next-auth.session-token");

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
