"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    EditableProfileForm,
} from "@/app/user/profile/form";

// Define a type for the user prop with agent info
type UserWithAgent = {
  role: "USER" | "AGENT" | "ADMIN" | string;
  agent: {
    fullName: string;
    phone: string;
    dateOfBirth: string | Date;
    gender: string;
    address: string;
    locality: string;
    nationalId?: string | null;
    idType?: string | null;
    joinedAt: string | Date;
  };
};

interface EditProps {
    user: UserWithAgent;
}

export default function Edit({ user }: EditProps) {
    const [editing, setEditing] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const [showSuccess, setShowSuccess] = useState(
        searchParams.get("success") === "1"
    );

    useEffect(() => {
        if (showSuccess) {
            const timeout = setTimeout(() => {
                setShowSuccess(false);
                const params = new URLSearchParams(window.location.search);
                params.delete("success");
                router.replace(
                    `/agent/profile${params.toString() ? "?" + params.toString() : ""}`
                );
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [showSuccess, router]);


    if (editing) {
        return (
            <EditableProfileForm
                user={user}
                onCancel={() => setEditing(false)}
            />
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-6 mt-12">
            <h1 className="text-4xl font-extrabold text-gray-900">Agent Profile</h1>

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
                            router.replace(
                                `/agent/profile${params.toString() ? "?" + params.toString() : ""}`
                            );
                        }}
                    >
                        7
                    </button>
                </div>
            )}

            <div className="bg-white p-8 rounded-2xl shadow space-y-4">
                {/* Role badge */}
                <div>
                  <span
                    className={
                      user.role === "USER"
                        ? "inline-block mb-2 px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold"
                        : user.role === "AGENT"
                        ? "inline-block mb-2 px-3 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold"
                        : user.role === "ADMIN"
                        ? "inline-block mb-2 px-3 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold"
                        : "inline-block mb-2 px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold"
                    }
                  >
                    {user.role}
                  </span>
                </div>
                {/* ...rest of the render logic... */}
                {/* User Data Section */}
                <div className="space-y-2 mb-6">
                  <div className="font-semibold text-lg text-gray-800 mb-2">User Info</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-gray-600 text-sm font-medium mb-1">Name</span>
                      <input value={user.name ?? ''} disabled className="w-full rounded bg-gray-100 border border-gray-200 px-3 py-2 text-gray-700" />
                    </div>
                    <div>
                      <span className="block text-gray-600 text-sm font-medium mb-1">Email</span>
                      <input value={user.email ?? ''} disabled className="w-full rounded bg-gray-100 border border-gray-200 px-3 py-2 text-gray-700" />
                    </div>
                  </div>
                </div>
                {/* Agent Details Section */}
                <div className="space-y-2">
                  <div className="font-semibold text-lg text-gray-800 mb-2">Agent Details</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-gray-600 text-sm font-medium mb-1">Full Name</span>
                      <input value={user.agent.fullName} disabled className="w-full rounded bg-gray-100 border border-gray-200 px-3 py-2 text-gray-700" />
                    </div>
                    <div>
                      <span className="block text-gray-600 text-sm font-medium mb-1">Phone</span>
                      <input value={user.agent.phone} disabled className="w-full rounded bg-gray-100 border border-gray-200 px-3 py-2 text-gray-700" />
                    </div>
                    <div>
                      <span className="block text-gray-600 text-sm font-medium mb-1">Date of Birth</span>
                      <input value={user.agent.dateOfBirth ? new Date(user.agent.dateOfBirth).toLocaleDateString() : ''} disabled className="w-full rounded bg-gray-100 border border-gray-200 px-3 py-2 text-gray-700" />
                    </div>
                    <div>
                      <span className="block text-gray-600 text-sm font-medium mb-1">Gender</span>
                      <input value={user.agent.gender} disabled className="w-full rounded bg-gray-100 border border-gray-200 px-3 py-2 text-gray-700" />
                    </div>
                    <div>
                      <span className="block text-gray-600 text-sm font-medium mb-1">Address</span>
                      <input value={user.agent.address} disabled className="w-full rounded bg-gray-100 border border-gray-200 px-3 py-2 text-gray-700" />
                    </div>
                    <div>
                      <span className="block text-gray-600 text-sm font-medium mb-1">Locality</span>
                      <input value={user.agent.locality} disabled className="w-full rounded bg-gray-100 border border-gray-200 px-3 py-2 text-gray-700" />
                    </div>
                    <div>
                      <span className="block text-gray-600 text-sm font-medium mb-1">National ID</span>
                      <input value={user.agent.nationalId ?? ''} disabled className="w-full rounded bg-gray-100 border border-gray-200 px-3 py-2 text-gray-700" />
                    </div>
                    <div>
                      <span className="block text-gray-600 text-sm font-medium mb-1">ID Type</span>
                      <input value={user.agent.idType ?? ''} disabled className="w-full rounded bg-gray-100 border border-gray-200 px-3 py-2 text-gray-700" />
                    </div>
                    <div>
                      <span className="block text-gray-600 text-sm font-medium mb-1">Joined At</span>
                      <input value={user.agent.joinedAt ? new Date(user.agent.joinedAt).toLocaleString() : ''} disabled className="w-full rounded bg-gray-100 border border-gray-200 px-3 py-2 text-gray-700" />
                    </div>
                  </div>
                </div>
                <div className="flex mt-8">
                  <button onClick={() => setEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow">Edit Profile</button>
                </div>
            </div>
        </div>
    );
}
