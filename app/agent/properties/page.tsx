// File: app/agent/properties/page.tsx
"use client";

import { useEffect, useState } from "react";


// Define the columns based on the Property model
// Property type based on schema
type Property = {
  id: string;
  title: string;
  slug: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  furnished: boolean;
  available: boolean;
  published: boolean;
  listedAt: string | Date;
  updatedAt: string | Date;
};

const columns = [
  { key: "title", label: "Title" },
  { key: "slug", label: "Slug" },
  { key: "propertyType", label: "Type" },
  { key: "bedrooms", label: "Bedrooms" },
  { key: "bathrooms", label: "Bathrooms" },
  { key: "area", label: "Area (sqft)" },
  { key: "price", label: "Price" },
  { key: "furnished", label: "Furnished" },
  { key: "available", label: "Available" },
  { key: "published", label: "Published" },
  { key: "listedAt", label: "Listed At" },
  { key: "updatedAt", label: "Updated At" },
];


export default function AgentPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      const res = await fetch("/api/properties?mine=true");
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || []);
      }
      setLoading(false);
    }
    fetchProperties();
  }, []);

  // Helper to safely get property value by key
  function getPropertyValue(property: Property, key: string) {
    switch (key) {
      case "title":
        return property.title;
      case "slug":
        return property.slug;
      case "propertyType":
        return property.propertyType;
      case "bedrooms":
        return property.bedrooms;
      case "bathrooms":
        return property.bathrooms;
      case "area":
        return property.area;
      case "price":
        return property.price;
      case "furnished":
      case "available":
      case "published":
        return property[key as keyof Pick<Property, 'furnished' | 'available' | 'published'>] ? "Yes" : "No";
      case "listedAt":
        return new Date(property.listedAt).toLocaleDateString();
      case "updatedAt":
        return new Date(property.updatedAt).toLocaleDateString();
      default:
        return "";
    }
  }

  return (
    <div className="p-6">
      {/* Add Property Card */}
      <div className="mb-6 flex justify-between items-center bg-white rounded-xl shadow p-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Add a New Property</h2>
          <p className="text-gray-600 text-sm">Create a new property listing to appear in your portfolio.</p>
        </div>
        <a
          href="/agent/properties/add"
          className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary/90 transition-colors"
        >
          Add Property
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-4">My Properties</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-2 text-left font-semibold">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    No properties found.
                  </td>
                </tr>
              ) : (
                properties.map((property, idx) => (
                  <tr key={property.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-2">
                        {getPropertyValue(property, col.key)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
