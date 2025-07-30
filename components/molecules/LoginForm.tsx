
"use client"

import { signIn } from "next-auth/react";
import { useState } from "react";

import { redirect, RedirectType } from "next/navigation";
import { cn } from "@/lib/utils";




interface LoginFormProps {
  email?: string | null;
  password?: string | null;
}

export function LoginForm({ email, password }: LoginFormProps) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email1 = formData.get("email");
    const password1 = formData.get("password");

    email = typeof email1 === "string" ? email1 : null;
    password = typeof password1 === "string" ? password1 : null;
    setPending(true)
    const response = await signIn("credentials", {
      email, password,
      redirect: false

    })
    if (response.error) {
      setPending(false)
      if (response.error === "CredentialsSignin")
        setError("Invalid Login in details")
      if (response.error === "Configuration")
        setError("Check your network connectivity")
    }
    else {
      redirect("/properties", RedirectType.push)
    }
  };
  return (
    <div>
      
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-6 min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          {error && <p>{error}</p>}
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Welcome Back</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email addresss
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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

            <div className="flex justify-between items-center">
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button disabled={pending}
              type="submit"
              className={cn("w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-sm transition duration-300", pending ? "cursor-not-allowed" : "cursor-pointer")}
            >
              {pending ? "Logging In" : "Login in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500" >
              Sign up
            </a>
          </p>
        </div>


      </div>
    </div>
  )
}

export default LoginForm