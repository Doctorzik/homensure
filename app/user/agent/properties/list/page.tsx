"use client";

import { useEffect, useState } from "react";


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

type EditState = {
  id: string;
  values: Partial<Property>;
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

export default function AgentPropertiesListPage() {
  async function handleDelete(propertyId: string) {
    if (!window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`/api/properties/${propertyId}`, { method: "DELETE" });
      if (res.ok || res.status === 204) {
        setProperties((prev: Property[]) => prev.filter((p: Property) => p.id !== propertyId));
      }
    } catch {}
  }
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);

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
        setProperties((prev: Property[]) => prev.map(p => p.id === editing.id ? data.property : p));
      }
    } catch {}
    setEditing(null);
  }

  return (
    <div>
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
              (editing && editing.id === property.id) ? (
                <tr key={property.id} className="bg-yellow-50">
                  {columns.map(col => (
                    col.key === "actions" ? (
                      <td key={col.key} className="border px-2 py-1">
                          <div className="flex flex-row gap-2 justify-center items-center">
                          <button
                            onClick={handleSaveEdit}
                            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-400 text-white px-2 py-1 rounded text-xs"
                          >
                            Cancel
                          </button>
                        </div>
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
                    col.key === "actions"
                      ? (
                        <td key={col.key} className="border px-2 py-1">
                          <div className="flex flex-row gap-6 justify-center items-center">
                            <button
                              className="text-blue-600 hover:underline px-2 py-1 text-xs"
                              onClick={() => handleEdit(property)}
                            >
                              Edit
                            </button>
                            <span className="h-5 w-px bg-gray-300 mx-1" />
                            <DeletePropertyButton
                              propertyId={property.id}
                              propertyTitle={property.title}
                              onDelete={handleDelete}
                            />
                          </div>
                        </td>
                      )
                      : (
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

type DeletePropertyButtonProps = {
  propertyId: string;
  propertyTitle: string;
  onDelete: (id: string) => void;
};

function DeletePropertyButton({ propertyId, propertyTitle, onDelete }: DeletePropertyButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <>
      <button
        className="bg-red-600 text-white px-2 py-1 rounded text-xs"
        onClick={() => setShowConfirm(true)}
      >
        Delete
      </button>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col items-center">
            <p className="mb-4 text-center text-sm">
              Are you sure you want to delete property <span className="font-semibold text-red-700">{propertyTitle}</span>?
            </p>
            <div className="flex flex-row gap-10 mt-2">
              <button
                className="bg-red-600 text-white px-4 py-1 rounded text-xs"
                onClick={() => { onDelete(propertyId); setShowConfirm(false); }}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-1 rounded text-xs"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

