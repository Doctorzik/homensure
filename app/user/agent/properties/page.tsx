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
  { key: "actions", label: "Actions" },
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

  const [editing, setEditing] = useState<{ id: string; values: Partial<Property> } | null>(null);

  function handleEdit(property: Property) {
    setEditing({ id: property.id, values: { ...property } });
  }
  function handleCancelEdit() {
    setEditing(null);
  }
  function handleEditChange(field: keyof Property, value: string | number | boolean) {
    if (!editing) return;
    setEditing({ ...editing, values: { ...editing.values, [field]: value } });
  }

  async function handleSaveEdit() {
    if (!editing) return;
    try {
      const res = await fetch(`/api/properties/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing.values),
      });
      if (res.ok) {
        const data = await res.json();
        setProperties((prev) => prev.map(p => p.id === editing.id ? data.property : p));
      }
    } catch {}
    setEditing(null);
  }

  async function handleDelete(propertyId: string) {
    if (!window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`/api/properties/${propertyId}`, { method: "DELETE" });
      if (res.ok || res.status === 204) {
        setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      }
    } catch {}
  }

  return (
    <div>
      <h1>Agent Properties</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full border mt-6">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} className="border px-2 py-1 bg-gray-100">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {properties.map(property => (
              editing && editing.id === property.id ? (
                <tr key={property.id} className="bg-yellow-50">
                  {columns.map(col => (
                    col.key === "actions" ? (
                      <td key={col.key} className="border px-2 py-1">
                        <button onClick={handleSaveEdit} className="text-green-600 mr-2">Save</button>
                        <button onClick={handleCancelEdit} className="text-gray-600">Cancel</button>
                      </td>
                    ) : (
                      <td key={col.key} className="border px-2 py-1">
                        <input
                          className="border px-1 py-0.5 w-full"
                          value={String(editing.values[col.key as keyof Property] ?? "")}
                          onChange={e => handleEditChange(col.key as keyof Property, e.target.value)}
                          disabled={col.key === 'id' || col.key === 'slug' || col.key === 'listedAt' || col.key === 'updatedAt'}
                        />
                      </td>
                    )
                  ))}
                </tr>
              ) : (
                <tr key={property.id}>
                  {columns.map(col => (
                    col.key === "actions" ? (
                      <td key={col.key} className="border px-2 py-1">
                        <button onClick={() => handleEdit(property)} className="text-blue-600 mr-2">Edit</button>
                        <button onClick={() => handleDelete(property.id)} className="text-red-600">Delete</button>
                      </td>
                    ) : (
                      <td key={col.key} className="border px-2 py-1">
                        {String(property[col.key as keyof Property] ?? "")}
                      </td>
                    )
                  ))}
                </tr>
              )
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


