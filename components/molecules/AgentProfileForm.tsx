// File: app/(user)/user/profile/form.tsx
"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";




interface AgentProfile {
  fullName?: string;
  phone?: string;
  dateOfBirth?: string | Date;
  gender?: string;
  address?: string;
  locality?: string;
  nationalId?: string | null;
  idType?: string | null;
  joinedAt?: string | Date;
}

interface EditableProfileFormProps {
  user: {
    name?: string;
    email?: string;
    role?: string;
    agent?: AgentProfile;
  };
  onCancel: () => void;
}

export function EditableProfileForm({
  user,
  onCancel,
}: EditableProfileFormProps) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        window.location.href = "/user/profile?success=1";
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data?.error || "Update failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow space-y-4 mt-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Edit Your Profile
      </h1>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-100 border border-red-300 text-red-800 flex justify-between items-center">
          <span>{error}</span>
          <button
            className="text-red-600 font-bold px-2"
            aria-label="Close"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(
            e.currentTarget as HTMLFormElement
          );
          await handleSubmit(formData);
        }}
        className="space-y-4"
      >
        {/* Common fields */}
        <Input label="Name" name="name" defaultValue={user.name ?? ""} />
        <Input label="Email" name="email" defaultValue={user.email ?? ""} />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="New Password"
        />

        {/* Agent-only fields */}
        {user.role === "AGENT" && user.agent && (
          <>
            <h2 className="text-xl font-semibold pt-6">Agent Details</h2>

            <Input
              label="Full Name"
              name="fullName"
              defaultValue={user.agent.fullName}
              disabled
              className="bg-gray-100 rounded-md"
            />
            <Input
              label="Phone"
              name="phone"
              defaultValue={user.agent.phone}
              disabled
              className="bg-gray-100 rounded-md"
            />
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              defaultValue={
                user.agent.dateOfBirth
                  ? new Date(user.agent.dateOfBirth)
                    .toISOString()
                    .split("T")[0]
                  : ""
              }
              disabled
              className="bg-gray-100 rounded-md"
            />
            <Input
              label="Gender"
              name="gender"
              defaultValue={user.agent.gender}
              disabled
              className="bg-gray-100 rounded-md"
            />
            <Input
              label="Address"
              name="address"
              defaultValue={user.agent.address}
              disabled
              className="bg-gray-100 rounded-md"
            />
            <Input
              label="Locality"
              name="locality"
              defaultValue={user.agent.locality}
              disabled
              className="bg-gray-100 rounded-md"
            />
            <Input
              label="National ID"
              name="nationalId"
              defaultValue={user.agent.nationalId ?? ""}
              disabled
              className="bg-gray-100 rounded-md"
            />
            <Input
              label="ID Type"
              name="idType"
              defaultValue={user.agent.idType ?? ""}
              disabled
              className="bg-gray-100 rounded-md"
            />
            <Input
              label="Joined At"
              name="joinedAt"
              defaultValue={user.agent.joinedAt ? new Date(user.agent.joinedAt).toLocaleString() : ""}
              disabled
              className="bg-gray-100 rounded-md"
            />
          </>
        )}

        <div className="flex gap-4 mt-8">
          <Button type="submit" className="text-white">
            Save Changes
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export function DisplayItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <span className="font-semibold text-gray-700">{label}:</span>
      <span className="ml-2 text-gray-500">{value ?? "-"}</span>
    </div>
  );
}
