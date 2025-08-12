"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const initialState = {
  title: "",
  description: "",
  propertyType: "APARTMENT",
  bedrooms: 1,
  bathrooms: 1,
  area: 0,
  price: 0,
  furnished: false,
  available: true,
  published: false,
  country: "",
  state: "",
  city: "",
  address: "",
  // images, videos, amenities, tags, latitude, longitude, isFeatured, agentId, reviews handled elsewhere or optional
};
// Example data for countries, states, and cities
type CountryStateCityType = {
  [country: string]: {
    [state: string]: string[];
  };
};
const countryStateCity: CountryStateCityType = {
  USA: {
    California: ["Los Angeles", "San Francisco", "San Diego"],
    Texas: ["Houston", "Dallas", "Austin"],
    NewYork: ["New York City", "Buffalo", "Rochester"],
  },
  Canada: {
    Ontario: ["Toronto", "Ottawa", "Hamilton"],
    Quebec: ["Montreal", "Quebec City", "Laval"],
    Alberta: ["Calgary", "Edmonton", "Red Deer"],
  },
  Mexico: {
    Jalisco: ["Guadalajara", "Zapopan", "Tlaquepaque"],
    CDMX: ["Mexico City"],
    NuevoLeon: ["Monterrey", "San Nicolas"],
  },
};


const propertyTypes = [
  "APARTMENT",
  "HOUSE",
  "STUDIO",
  "DUPLEX",
  "COMMERCIAL",
  "LAND",
];


export default function AddPropertyPage() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [agentId, setAgentId] = useState<string>("");
  const router = useRouter();

  // Fetch agentId on mount
  React.useEffect(() => {
    async function fetchAgentId() {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.user && data.user.agent && data.user.agent.id) {
          setAgentId(data.user.agent.id);
        }
      }
    }
    fetchAgentId();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    let checked = false;
    if (type === "checkbox") {
      checked = (e.target as HTMLInputElement).checked;
    }
    setForm((prev) => {
      if (name === "country") {
        return { ...prev, country: value, state: "", city: "" };
      }
      if (name === "state") {
        return { ...prev, state: value, city: "" };
      }
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, agentId }),
      });
      if (res.ok) {
        router.push("/user/agent/properties");
      } else {
        setSubmitting(false);
        alert("Failed to add property. Please try again.");
      }
    } catch {
      setSubmitting(false);
      alert("Failed to add property. Please try again.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Add New Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Property Type</label>
          <select name="propertyType" value={form.propertyType} onChange={handleChange} className="w-full border rounded px-3 py-2">
            {propertyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Bedrooms</label>
            <input name="bedrooms" type="number" min={0} value={form.bedrooms} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Bathrooms</label>
            <input name="bathrooms" type="number" min={0} value={form.bathrooms} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Area (m2)</label>
            <input name="area" type="number" min={0} value={form.area} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Price</label>
            <input name="price" type="number" min={0} value={form.price} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="flex gap-8 justify-center items-center">
          <div className="flex gap-16 justify-center items-center">
            <label className="flex flex-row items-center gap-2">
              <input name="furnished" type="checkbox" checked={form.furnished} onChange={handleChange} className="w-6 h-6 accent-blue-600" />
              <span className="text-sm">Furnished</span>
            </label>
            <label className="flex flex-row items-center gap-2">
              <input name="available" type="checkbox" checked={form.available} onChange={handleChange} className="w-6 h-6 accent-blue-600" />
              <span className="text-sm">Available</span>
            </label>
            <label className="flex flex-row items-center gap-2">
              <input name="published" type="checkbox" checked={form.published} onChange={handleChange} className="w-6 h-6 accent-blue-600" />
              <span className="text-sm">Published</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Address</label>
          <input name="address" value={form.address} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Country</label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="" disabled>Select Country</option>
              {Object.keys(countryStateCity).map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">State</label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              disabled={!form.country}
            >
              <option value="" disabled>Select State</option>
              {form.country && Object.keys(countryStateCity[form.country] || {}).map((state: string) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">City</label>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              disabled={!form.state}
            >
              <option value="" disabled>Select City</option>
              {form.country && form.state && (countryStateCity[form.country]?.[form.state] || []).map((city: string) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition-colors"
          >
            {submitting ? "Adding..." : "Add Property"}
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded font-semibold hover:bg-gray-400 transition-colors"
            onClick={() => {
              const isDirty = Object.keys(initialState).some(
                (key) => {
                  const val = form[key as keyof typeof initialState];
                  const init = initialState[key as keyof typeof initialState];
                  return val !== init;
                }
              );
              if (isDirty) {
                // Custom modal for clarity
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100vw';
                modal.style.height = '100vh';
                modal.style.background = 'rgba(0,0,0,0.4)';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.zIndex = '9999';
                modal.innerHTML = `
                  <div style="background:white;padding:2rem 2rem 1.5rem 2rem;border-radius:1rem;max-width:90vw;width:350px;box-shadow:0 4px 32px rgba(0,0,0,0.18);text-align:center;">
                    <div style="font-size:1.1rem;font-weight:600;margin-bottom:0.5rem;">You have unsaved changes</div>
                    <div style="margin-bottom:1.5rem;">Are you sure you want to leave this page and discard them?</div>
                    <div style="display:flex;gap:1rem;justify-content:center;">
                      <button id="stayBtn" style="flex:1;padding:0.5rem 0;background:#4b5563;color:white;border:none;border-radius:0.5rem;font-weight:600;">Stay on Page</button>
                      <button id="discardBtn" style="flex:1;padding:0.5rem 0;background:#dc2626;color:white;border:none;border-radius:0.5rem;font-weight:600;">Discard Changes</button>
                    </div>
                  </div>
                `;
                document.body.appendChild(modal);
                modal.querySelector('#stayBtn')?.addEventListener('click', () => {
                  document.body.removeChild(modal);
                });
                modal.querySelector('#discardBtn')?.addEventListener('click', () => {
                  document.body.removeChild(modal);
                  window.location.href = '/user/agent/properties';
                });
                return;
              }
              window.location.href = '/user/agent/properties';
            }}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
