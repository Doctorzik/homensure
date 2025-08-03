"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    EditableProfileForm,
    DisplayItem,
} from "@/app/(user)/user/profile/form";

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
    sessionEmail: string;
}

export default function Edit({ user, sessionEmail }: EditProps) {
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
                    `/user/agent/profile${params.toString() ? "?" + params.toString() : ""}`
                );
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
                                `/user/agent/profile${params.toString() ? "?" + params.toString() : ""}`
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
