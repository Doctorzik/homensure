// File: app/(website)/properties/page.tsx


import { getAllProperties } from '@/lib/actions/agent-actions';
import { auth } from '@/lib/auth';


import Link from 'next/link';
import { redirect } from "next/navigation";


export default async function PropertiesPage() {


  const session = await auth();




  if (!session) {
    redirect("/login")

  }
  const result = await getAllProperties()



  // TODO: replace this stub with real data fetching



  return (
    <>
      {result.length === 0 ? <div>
        NO Properties
      </div> :
        <main className="px-6 py-10">

          <h1 className="text-3xl font-semibold mb-6">Available Rentals</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {result.map((property) => (
              <Link
                key={property.slug}
                href={`/properties/${property.slug}`}
                className="block bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h2 className="text-2xl font-medium mb-2">{property.title}</h2>
                <p className="text-gray-600 mb-2">{property.description}</p>
                <p className="text-sm text-gray-500 mb-1">
                  Posted: {new Date(property.listedAt).toLocaleDateString()}
                </p>
                <p className="text-xl font-bold mb-1">${property.price}</p>

                <p className="text-sm">
                  Agent: {property.agent.fullName}
                  {session && (
                    <span className="block text-gray-500">
                      Contact: {property.agent.phone}
                    </span>
                  )}
                </p>
              </Link>
            ))}
          </div>

          {session.user?.name}


        </main>}</>
  );
}
