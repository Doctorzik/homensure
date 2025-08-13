"use client";
import { useSession } from "next-auth/react";


import { createProperty } from "@/lib/actions/agent-actions";
import { useForm } from "react-hook-form"
import z from "zod";
import { Property, propertySchema } from "@/lib/schemas/userSchema";



import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";



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




export function AddPropertyPage() {


  const session = useSession()




 



  const fom = useForm<z.infer<typeof propertySchema>>({
    defaultValues: {
      address: "",
      city: "",
      country: "",
      // amenities: [],
      area: 0,
      price: 0,
      listingDuration: 30,
      bedrooms: 0,
      state: "",
      tags: [],
      images: ["https://picsum.photos/200"],
      propertyType: "APARTMENT",
      description: "",
      title: "",
      bathrooms: 0,
      videos: [],
      slug: "",
      furnished: true,
      available: true,
    }
  })

  const selectedCountry = fom.watch("country");
  const selectedState = fom.watch("state");
  const slugs = fom.getValues("title")




  async function handleSubmit(data: Property) {

    const real = { ...data, slug: slugs };
    const validate = propertySchema.parse(real)


     await createProperty(validate, session.data?.user.email as string)
     
    
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Add New Property</h1>
      <form onSubmit={fom.handleSubmit(handleSubmit)} className="space-y-4">
        <div>
          <Input className="block mb-1  border rounded-sm px-3 py-2" label="Title" {...fom.register("title", { required: true })} />
          {fom.formState.errors.title && <span className="text-red-400">Title is required </span>}
        </div>
        <div>
          <Label htmlFor="description" className="block font-semibold mb-1">Description</Label>
          <Textarea id="description"  {...fom.register("description", { required: true })} className="w-full border rounded px-3 py-2" />
          {fom.formState.errors.description && <span className="text-red-400">Give a proper description of the property you are listing </span>}

        </div>
        <div>
          <Label htmlFor="propertyType" className="block font-semibold mb-1">Property Type</Label>
          <select id="propertyType" {...fom.register("propertyType")} className="w-full border rounded px-3 py-2">
            {propertyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {fom.formState.errors.propertyType && <span className="text-red-400">Please select the type of property</span>}

        </div>
        <div className="flex gap-4">
          <div className="flex-1">

            <Input label="Bedrooms"  {...fom.register("bedrooms", { required: true, min: 1, valueAsNumber: true })} type="number" min={0} className="w-full border rounded px-3 py-2" />
            {fom.formState.errors.bedrooms && <span className="text-red-400">How many rooms does this property have</span>}

          </div>
          <div className="flex-1">

            <Input label="Bathrooms" {...fom.register("bathrooms", { required: true, min: 1, valueAsNumber: true })} className="w-full border rounded px-3 py-2" />
            {fom.formState.errors.bathrooms && <span className="text-red-400">How many bathrooms does this property have</span>}

          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">

            <Input label="Area (m2)" {...fom.register("area", { required: true, min: 1, valueAsNumber: true })} className="w-full border rounded px-3 py-2" />
            {fom.formState.errors.area && <span className="text-red-400">Specify the area of the property</span>}
          </div>
          <div className="flex-1">

            <Input  {...fom.register("price", { required: true, min: 0, valueAsNumber: true })} label="Price" className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="flex gap-8 justify-center items-center">
          <div className="flex gap-16 justify-center items-center">
            <label htmlFor="furnished" className="flex flex-row items-center gap-2">
              <input id="furnished" type="checkbox" {...fom.register("furnished")} className="w-6 h-6 accent-blue-600" />
              <span className="text-sm">Furnished</span>
            </label>
            <label className="flex flex-row items-center gap-2">
              <input type="checkbox"  {...fom.register("available")} className="w-6 h-6 accent-blue-600" />
              <span className="text-sm">Available</span>
            </label>
          </div>
        </div>
        <div>
          <Label htmlFor="address" className="block font-semibold mb-1">Address</Label>
          <Textarea id="address" {...fom.register("address", { required: true })} className="w-full border rounded px-3 py-2" />
          {fom.formState.errors.address && <span className="text-red-400">Give a detailed description of the property location</span>}

        </div>
        <div className="flex gap-4">
          {/* Country */}
          <div className="flex-1">
            <label className="block font-semibold mb-1">Country</label>
            <select
              {...fom.register("country", { required: true })}
              onChange={(e) => {
                fom.setValue("country", e.target.value);
                fom.setValue("state", ""); // reset state when country changes
                fom.setValue("city", ""); // reset city when country changes
              }}
              className="w-full border rounded px-3 py-2"
            >
              <option value="" disabled>Select Country</option>
              {Object.keys(countryStateCity).map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {fom.formState.errors.country && <span className="text-red-400">Country must be same with your country</span>}

          </div>

          {/* State */}
          <div className="flex-1">
            <label className="block font-semibold mb-1">State</label>
            <select
              {...fom.register("state", { required: true })}
              onChange={(e) => {
                fom.setValue("state", e.target.value);
                fom.setValue("city", ""); // reset city when state changes
              }}
              className="w-full border rounded px-3 py-2"
              disabled={!selectedCountry}
            >
              <option value="" disabled>Select State</option>
              {selectedCountry &&
                Object.keys(countryStateCity[selectedCountry] || {}).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
            </select>
            {fom.formState.errors.state && <span className="text-red-400">State must be same with your state</span>}

          </div>

          {/* City */}
          <div className="flex-1">
            <label className="block font-semibold mb-1">City</label>
            <select
              {...fom.register("city", { required: true })}
              className="w-full border rounded px-3 py-2"
              disabled={!selectedState}
            >
              <option value="" disabled>Select City</option>
              {selectedCountry &&
                selectedState &&
                (countryStateCity[selectedCountry]?.[selectedState] || []).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>
            {fom.formState.errors.city && <span className="text-red-400">City must be same with your city</span>}

          </div>
        </div>
        {/* <div className="flex flex-wrap gap-3">
          {amenities.map((amenity) => {
            const selectedAmenities = fom.getValues("amenities") as { name: string; id?: string | undefined }[] || [];
            const isSelected = selectedAmenities.some((a) => a.name === amenity.name);
            return (
              <div
                className={`cursor-pointer transition-all hover:scale-105 active:scale-95 text-sm px-4 py-1.5 rounded-full ${isSelected ? "bg-blue-100 border border-blue-400" : "bg-gray-100"}`}
                key={amenity.id}
                onClick={() => {
                  fom.setValue(
                    "amenities",
                    isSelected
                      ? selectedAmenities.filter((a) => a.name !== amenity.name)
                      : [...selectedAmenities, { name: amenity.name }]
                  );
                }}
              >
                <p>{amenity.name}</p>
                <span><amenity.icon /></span>
              </div>
            );
          })}
        </div> */}

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={fom.formState.isLoading}
            className="flex-1 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition-colors"
          >
            {fom.formState.isLoading ? "Adding..." : "Add Property"}
          </Button>
          <button
            type="button"
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded font-semibold hover:bg-gray-400 transition-colors"

            disabled={fom.formState.isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
