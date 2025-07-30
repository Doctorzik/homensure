// File: app/(website)/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';


export default function HomePage() {



	const [search, setSearch] = useState('');
	const router = useRouter();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (!search) return;
		router.push(`/properties/?query=${encodeURIComponent(search)}`);
	};

	const topCities = ['New York', 'Los Angeles', 'Chicago', 'Houston'];
	const testimonials = [
		{ name: 'Alice', text: 'RentLynk made my move so easy!' },
		{ name: 'Bob', text: 'Great selection and smooth booking.' },
		{ name: 'Charlie', text: 'Transparent pricing and excellent support.' },
	];

	return (
		<main className="space-y-20">
			{/* Hero Banner + Search */}
			<section
				className="relative h-screen bg-cover bg-center"
				style={{ backgroundImage: "url('/hero.jpg')" }}
			>
				<div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-6">
					<h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
						Find Your Next Home. Simple. Secure. Transparent.
					</h1>
					<form onSubmit={handleSearch} className="flex w-full max-w-xl">
						<input
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder="Search city, neighborhood or ZIP"
							className="flex-grow px-4 py-2 rounded-l-xl border border-gray-300 focus:outline-none"
						/>
						<button
							type="submit"
							className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-r-xl"
						>
							Search
						</button>
					</form>
				</div>
			</section>

			{/* How It Works */}
			<section className="py-16 bg-white text-center">
				<h2 className="text-3xl font-semibold mb-10">How It Works</h2>
				<div className="flex flex-col md:flex-row justify-center items-start gap-8 px-6">
					{['Search', 'Book', 'Move In'].map((step, i) => (
						<div key={i} className="max-w-xs bg-gray-100 p-6 rounded-xl shadow">
							<div className="text-2xl font-bold mb-2">{i + 1}.</div>
							<h3 className="text-xl font-medium mb-1">{step}</h3>
							<p>
								{step === 'Search' && 'Browse hundreds of listings to find your perfect match.'}
								{step === 'Book' && 'Schedule a tour or book instantly online.'}
								{step === 'Move In' && 'Sign and get your keys delivered right away.'}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Top Locations */}
			<section className="py-16 bg-gray-50">
				<h2 className="text-3xl font-semibold text-center mb-10">Top Locations</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
					{topCities.map(city => (
						<Link
							key={city}
							href={`/properties?location=${encodeURIComponent(city)}`}
							className="relative h-40 rounded-xl overflow-hidden shadow-lg group"
						>
							<Image
								src={`/locations/${city.toLowerCase().replace(/ /g, '-')}.jpg`}
								alt={city}
								fill
								className="object-cover transform group-hover:scale-105 transition"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center">
								<span className="text-white font-semibold text-lg">{city}</span>
							</div>
						</Link>
					))}
				</div>
			</section>

			{/* Benefits */}
			<section className="py-16 bg-white">
				<h2 className="text-3xl font-semibold text-center mb-10">Why RentLynk?</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
					<div>
						<h3 className="text-xl font-medium mb-4">For Tenants</h3>
						<ul className="list-disc list-inside space-y-2">
							<li>Verified listings for a safe search</li>
							<li>Transparent pricing with no hidden fees</li>
							<li>Secure booking and payment</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium mb-4">For Agents</h3>
						<ul className="list-disc list-inside space-y-2">
							<li>Reach more prospective tenants</li>
							<li>Easy property management dashboard</li>
							<li>Analytics to optimize your listings</li>
						</ul>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-16 bg-gray-50">
				<h2 className="text-3xl font-semibold text-center mb-10">What Our Clients Say</h2>
				<div className="max-w-4xl mx-auto overflow-x-auto px-6">
					<div className="flex space-x-6">
						{testimonials.map((rev, idx) => (
							<div key={idx} className="min-w-[260px] bg-white p-6 rounded-xl shadow">
								<p className="italic mb-4">“{rev.text}”</p>
								<p className="font-semibold text-right">— {rev.name}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Call To Action */}
			<section className="py-16 bg-white text-center">
				<h2 className="text-3xl font-semibold mb-6">Ready to get started?</h2>
				<div className="flex justify-center gap-6">
					<Link
						href="/properties"
						className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl"
					>
						Browse Rentals
					</Link>
					<Link
						href="/register"
						className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl"
					>
						List Your Property
					</Link>
				</div>
			</section>
		</main>
	);
}
