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
