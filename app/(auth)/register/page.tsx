// File: app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUser } from '@/lib/actions/auth-action';

export default function RegisterPage() {

	const router = useRouter();
	const [form, setForm] = useState({
		name: "",
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState('');
	const [summiting, setSubmitting] = useState(false)


	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent,) => {
		e.preventDefault();
		setError('');
		if (form.password !== form.confirmPassword) {
			setError("Passwords don't match.");
			return;
		}


		const name = form.name
		const email = form.email
		const password = form.password

		const fore = new FormData()
		fore.append("name", name)
		fore.append("email", email)
		fore.append("password", password)


		// // Call the API route instead of createUser directly
		// const response = await fetch('/api/register', {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify({
		// 		name: form.name,
		// 		email: form.email,
		// 		password: form.password,
		// 	}),
		// });
		setSubmitting(true)
		const result = await createUser(fore)
		if (result) {
			setSubmitting(false)
			router.push('/login');
		}

		else {
			setSubmitting(false)
			setError("Something happend during registration")
		}






	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-6">
			<div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
				<h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Create an Account</h2>
				{error && (<p className="text-red-600 text-sm mb-4">{error}</p>)}
				<form onSubmit={handleSubmit} className="space-y-5">

					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700">
							Full Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={form.name}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email address
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							value={form.password}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div>
						<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
							Confirm Password
						</label>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							value={form.confirmPassword}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<button disabled={summiting}
						type="submit"
						className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow-sm transition duration-300"
					>
						Sign Up
					</button>
				</form>

				<p className="mt-6 text-sm text-center text-gray-600">
					Already have an account?{' '}
					<Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
						Log in
					</Link>
				</p>
			</div>
		</div>
	);
}
