// File: app/(website)/properties/page.tsx


import { auth } from '@/lib/auth';


import Link from 'next/link';
import { redirect } from "next/navigation";


export default async function PropertiesPage() {


  const session = await auth();

  if (!session) {
    redirect("/login")

  }

  // TODO: replace this stub with real data fetching
  const properties = [
    {
      slug: 'modern-downtown-flat',
      name: 'Modern Downtown Flat',
      description: 'A sleek 2-bedroom apartment in the heart of the city.',
      datePosted: '2025-07-10',
      price: 1800,
      reviews: [4, 5, 5, 3],
      agent: { name: 'Jane Doe', contact: 'jane.doe@example.com' },
    },
    {
      slug: 'cozy-suburban-home',
      name: 'Cozy Suburban Home',
      description: 'A charming 3-bed house with front and back yard.',
      datePosted: '2025-07-05',
      price: 2200,
      reviews: [5, 5, 4],
      agent: { name: 'John Smith', contact: 'john.smith@example.com' },
    },
  ];

  return (
    <main className="px-6 py-10">

      <h1 className="text-3xl font-semibold mb-6">Available Rentals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {properties.map((property) => (
          <Link
            key={property.slug}
            href={`/properties/${property.slug}`}
            className="block bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-medium mb-2">{property.name}</h2>
            <p className="text-gray-600 mb-2">{property.description}</p>
            <p className="text-sm text-gray-500 mb-1">
              Posted: {new Date(property.datePosted).toLocaleDateString()}
            </p>
            <p className="text-xl font-bold mb-1">${property.price}</p>
            <p className="text-sm text-gray-700 mb-2">
              {property.reviews.length} review{property.reviews.length !== 1 && 's'} • Avg.{' '}
              {(property.reviews.reduce((a, b) => a + b, 0) / property.reviews.length).toFixed(1)}★
            </p>
            <p className="text-sm">
              Agent: {property.agent.name}
              {session && (
                <span className="block text-gray-500">
                  Contact: {property.agent.contact}
                </span>
              )}
            </p>
          </Link>
        ))}
      </div>
      
    {session.user?.name}
      

    </main>
  );
}
