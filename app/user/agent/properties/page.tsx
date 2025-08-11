"use client";

import { useEffect, useState } from "react";
// Define the columns based on the Property model

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
  { key: "actions", label: "Actions" },
];

export default function AgentPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  // Removed editing state after switching to a dedicated edit page
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

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

  // Removed unused edit-related functions after switching to a dedicated edit page

  function openDeleteConfirm(property: Property) {
    setDeleteConfirm({ id: property.id, title: property.title });
  }

  async function confirmDelete() {
    if (!deleteConfirm) return;
    try {
      const res = await fetch(`/api/properties/${deleteConfirm.id}`, { method: "DELETE" });
      if (res.ok || res.status === 204) {
        setProperties((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
      }
    } catch {}
    setDeleteConfirm(null);
  }

  function cancelDelete() {
    setDeleteConfirm(null);
  }

  return (
    <div className="w-full max-w-[98vw] mx-auto p-2 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Agent Properties</h1>
      {/* Add Property Card */}
      <div className="w-full flex justify-center mb-6">
        <div className="bg-white rounded-xl shadow p-4 md:p-6 w-full max-w-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-lg font-semibold">Add a Property</div>
          <button
            className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-semibold shadow"
            onClick={() => window.location.href = '/user/agent/properties/add'}
          >
            Create New
          </button>
        </div>
      </div>
      {/* Properties Table Card */}
      <div className="bg-white rounded-xl shadow p-2 md:p-6 w-full overflow-x-auto">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-[1100px] w-full border text-xs md:text-sm">
            <thead>
              <tr>
                {columns.map(col => {
                  const rightAlign = ["bedrooms", "bathrooms", "area", "price"].includes(col.key);
                  return (
                    <th
                      key={col.key}
                      className={`border px-2 py-2 bg-gray-100 font-semibold whitespace-nowrap ${rightAlign ? 'text-right' : 'text-center'}`}
                    >
                      {col.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {properties.map(property => (
                <tr key={property.id} className="even:bg-gray-50">
                  {columns.map(col => {
                    const rightAlign = ["bedrooms", "bathrooms", "area", "price"].includes(col.key);
                    return col.key === "actions" ? (
                      <td key={col.key} className="border px-2 py-1 text-center">
                        <div className="flex gap-2 justify-center">
                          <a
                            href={`/user/agent/properties/edit/${property.id}`}
                            className="inline-flex items-center px-6 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs font-semibold"
                          >
                            Edit
                          </a>
                          <button
                            onClick={() => openDeleteConfirm(property)}
                            className="inline-flex items-center px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    ) : (
                      <td key={col.key} className={`border px-2 py-1 ${rightAlign ? 'text-right' : 'text-center'}`}>
                        {col.key === 'listedAt' || col.key === 'updatedAt' ? (
                          property[col.key] ? new Date(property[col.key] as string).toLocaleDateString() : ""
                        ) : col.key === 'furnished' ? (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${property.furnished ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                            {property.furnished ? 'Furnished' : 'Unfurnished'}
                          </span>
                        ) : col.key === 'available' ? (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${property.available ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                            {property.available ? 'Available' : 'Not Available'}
                          </span>
                        ) : col.key === 'published' ? (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${property.published ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                            {property.published ? 'Published' : 'Unpublished'}
                          </span>
                        ) : (
                          String(property[col.key as keyof Property] ?? "")
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col items-center">
            <p className="mb-4 text-center text-sm">
              Are you sure you want to delete property <span className="font-semibold text-red-700">{deleteConfirm.title}</span>?
            </p>
            <div className="flex flex-row gap-6 mt-2">
              <button
                className="bg-red-600 text-white px-3 py-1 rounded text-xs min-w-[80px]"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded text-xs min-w-[80px]"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


