// File: app/components/molecules/LoginForm.tsx

"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LoginFormProps {
	email?: string | null;
	password?: string | null;
}

export function LoginForm({ email, password }: LoginFormProps) {
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setPending(true);

		const formData = new FormData(e.currentTarget);
		const email1 = formData.get("email");
		const password1 = formData.get("password");

		email = typeof email1 === "string" ? email1 : null;
		password = typeof password1 === "string" ? password1 : null;

		// Attempt to sign in without redirect
		const response = await signIn("credentials", {
		email,
		password,
		redirect: false,
		});

		if (response?.error) {
		setPending(false);
		switch (response.error) {
			case "CredentialsSignin":
			setError("Invalid login details");
			break;
			case "Configuration":
			setError("Incorrect email or password");
			break;
			default:
			setError("An unknown error occurred");
		}
		return;
		}

		// On success, fetch the session to get the user.role
		const session = await getSession();
		setPending(false);

		if (session?.user?.role === "AGENT") {
		router.push("/agent/profile");
		} else if (session?.user?.role === "ADMIN") {
		router.push("/system/dashboard");
		} else {
		// Default to tenant profile
		router.push("/user/profile");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-6">
		<div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
			{error && <p className="text-red-500 mb-4">{error}</p>}
			<h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
			Welcome Back
			</h2>

			<form className="space-y-5" onSubmit={handleSubmit}>
			<div>
				<label
				htmlFor="email"
				className="block text-sm font-medium text-gray-700"
				>
				Email address
				</label>
				<input
				name="email"
				type="email"
				id="email"
				autoComplete="email"
				required
				className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>

			<div>
				<label
				htmlFor="password"
				className="block text-sm font-medium text-gray-700"
				>
				Password
				</label>
				<input
				name="password"
				type="password"
				id="password"
				autoComplete="current-password"
				required
				className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>

			<div className="text-sm text-right">
				<a
				href="#"
				className="font-medium text-blue-600 hover:text-blue-500"
				>
				Forgot your password?
				</a>
			</div>

			<button
				disabled={pending}
				type="submit"
				className={cn(
				"w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-sm transition duration-300",
				pending ? "cursor-not-allowed opacity-50" : "cursor-pointer"
				)}
			>
				{pending ? "Logging In..." : "Log In"}
			</button>
			</form>

			<p className="mt-6 text-sm text-center text-gray-600">
			Don’t have an account?{" "}
			<a
				href="/register"
				className="font-medium text-blue-600 hover:text-blue-500"
			>
				Sign up
			</a>
			</p>
		</div>
		</div>
	);
}

export default LoginForm;
