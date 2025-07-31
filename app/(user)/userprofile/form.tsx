// File: app/(user)/userprofile/form.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditableProfileFormProps {
  user: any;
  sessionEmail: string;
  onCancel: () => void;
}

export function EditableProfileForm({ user, sessionEmail, onCancel }: EditableProfileFormProps) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Redirect with success indicator
        window.location.href = "/userprofile?success=1";
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data?.error || "Update failed. Please try again.");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow space-y-4 mt-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Your Profile</h1>

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
          const formData = new FormData(e.currentTarget as HTMLFormElement);
          await handleSubmit(formData);
        }}
        className="space-y-4"
      >
        <Input label="Name" name="name" defaultValue={user.name ?? ""} />
        <Input label="Email" name="email" defaultValue={user.email ?? ""} />
        <Input label="Image URL" name="image" defaultValue={user.image ?? ""} />
        <Input label="Password" name="password" type="password" placeholder="New Password" />
        <Input label="Agent Address" name="agentAddress" defaultValue={user.agent?.address ?? ""} />

        <div className="flex gap-4 mt-8">
          <Button type="submit" className="text-white">Save Changes</Button>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}

export function ProfileWithToggle({ user, sessionEmail }: { user: any; sessionEmail: string }) {
  const [editing, setEditing] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Show success banner if redirected with ?success=1
  const [showSuccess, setShowSuccess] = useState(searchParams.get("success") === "1");

  // Auto-dismiss success banner after 5s and remove query param
  useEffect(() => {
    if (showSuccess) {
      const timeout = setTimeout(() => {
        setShowSuccess(false);
        const params = new URLSearchParams(window.location.search);
        params.delete("success");
        router.replace(`/userprofile${params.toString() ? "?" + params.toString() : ""}`);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [showSuccess, router]);

  if (editing) {
    return (
      <EditableProfileForm
        user={user}
        sessionEmail={sessionEmail}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6 mt-12">
      <h1 className="text-4xl font-extrabold text-gray-900">Your Profile</h1>

      {showSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-green-100 border border-green-300 text-green-800 flex justify-between items-center">
          <span>Profile updated successfully!</span>
          <button
            className="text-green-600 font-bold px-2"
            aria-label="Close"
            onClick={() => {
              setShowSuccess(false);
              const params = new URLSearchParams(window.location.search);
              params.delete("success");
              router.replace(`/userprofile${params.toString() ? "?" + params.toString() : ""}`);
            }}
          >
            ×
          </button>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow space-y-4">
        <DisplayItem label="Name" value={user.name} />
        <DisplayItem label="Email" value={user.email} />
        <DisplayItem
          label="Email Verified"
          value={user.emailVerified ? new Date(user.emailVerified).toLocaleString() : null}
        />
        <DisplayItem label="Role" value={user.role} />
        <DisplayItem label="Image URL" value={user.image} />
        <DisplayItem
          label="Created At"
          value={user.createdAt ? new Date(user.createdAt).toLocaleString() : null}
        />
        <DisplayItem
          label="Updated At"
          value={user.updatedAt ? new Date(user.updatedAt).toLocaleString() : null}
        />
        {user.agent && <DisplayItem label="Agent Address" value={user.agent.address} />}
      </div>

      <Button onClick={() => setEditing(true)} className="text-white">
        Edit Profile
      </Button>
    </div>
  );
}

function DisplayItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <span className="font-semibold text-gray-700">{label}:</span>
      <span className="ml-2 text-gray-500">{value ?? "-"}</span>
    </div>
  );
}
