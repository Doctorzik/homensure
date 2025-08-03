// File: app/(user)/user/profile/ProfileWithToggle.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EditableProfileForm, DisplayItem } from "./form";

interface ProfileWithToggleProps {
    user: any;
    sessionEmail: string;
}

export default function ProfileWithToggle({ user, sessionEmail }: ProfileWithToggleProps) {
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
                    `/user/profile${params.toString() ? "?" + params.toString() : ""}`
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
                            router.replace(
                                `/user/profile${params.toString() ? "?" + params.toString() : ""}`
                            );
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="bg-white p-8 rounded-2xl shadow space-y-4">
                <DisplayItem label="Name" value={user.name} />
                <DisplayItem label="Email" value={user.email} />

                {user.role === "AGENT" && user.agent && (
                    <>
                        <DisplayItem label="Full Name" value={user.agent.fullName} />
                        <DisplayItem label="Phone"     value={user.agent.phone} />
                        <DisplayItem
                            label="Date of Birth"
                            value={new Date(user.agent.dateOfBirth).toLocaleDateString()}
                        />
                        {/* …add the other agent fields here as needed */}
                    </>
                )}
            </div>

            <Button onClick={() => setEditing(true)} className="text-white">
                Edit Profile
            </Button>
        </div>
    );
}
