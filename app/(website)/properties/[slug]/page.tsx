// File: app/(website)/properties/[slug]/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from "next/navigation";;
// import Image from 'next/image';
// import Link from 'next/link';


// interface PageProps {
//   params: { slug: string };
// }
export default async function PropertyPage() {
   
  const session = await auth()
  if (!session) redirect("/login")
     
  // TODO: replace stub with real data fetch based on slug

  // // Example stub property (replace with real fetch using `slug`)
  // const property = {
  //   slug,
  //   name: 'Modern Downtown Flat',
  //   description: 'A sleek 2-bedroom apartment in the heart of the city, with a fully equipped kitchen, in-unit laundry, and skyline views.',
  //   datePosted: '2025-07-10',
  //   price: 1800,
  //   images: [
  //     '/properties/modern-downtown-flat-1.jpg',
  //     '/properties/modern-downtown-flat-2.jpg',
  //   ],
  //   videos: ['/properties/modern-downtown-tour.mp4'],
  //   reviews: [
  //     { user: 'Alice', rating: 5, text: 'Absolutely loved this place!' },
  //     { user: 'Bob', rating: 4, text: 'Great location, modern amenities.' },
  //   ],
  //   agent: { name: 'Jane Doe', contact: 'jane.doe@example.com' },
  // };

  return (
    // <main className="px-6 py-10 space-y-8">
    //   <Link href="/properties" className="text-blue-600 hover:underline">
    //     ← Back to listings
    //   </Link>

    //   <h1 className="text-3xl font-semibold">{property.name}</h1>
    //   <p className="text-sm text-gray-500">
    //     Posted: {new Date(property.datePosted).toLocaleDateString()}
    //   </p>
    //   <p className="text-2xl font-bold">${property.price}</p>

    //   {/* Media Gallery */}
    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //     {property.images.map((src, i) => (
    //       <div key={i} className="relative w-full h-60 rounded-xl overflow-hidden">
    //         <Image src={src} alt={`${property.name} ${i + 1}`} fill className="object-cover" />
    //       </div>
    //     ))}
    //   </div>
    //   {property.videos.length > 0 && (
    //     <div>
    //       {property.videos.map((src, i) => (
    //         <video key={i} controls className="w-full rounded-xl mb-4">
    //           <source src={src} type="video/mp4" />
    //         </video>
    //       ))}
    //     </div>
    //   )}

    //   {/* Details & Description */}
    //   <section>
    //     <h2 className="text-2xl font-semibold mb-2">Description</h2>
    //     <p>{property.description}</p>
    //   </section>

    //   {/* Reviews */}
    //   <section>
    //     <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
    //     <div className="space-y-4">
    //       {property.reviews.map((rev, idx) => (
    //         <div key={idx} className="border-b pb-4">
    //           <p className="font-semibold">
    //             {rev.user} — {rev.rating}★
    //           </p>
    //           <p>{rev.text}</p>
    //         </div>
    //       ))}
    //     </div>
    //   </section>
    // </main>
   <div>{}</div>
  );
}