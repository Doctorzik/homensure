// File: app/(user)/user/profile/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EditableProfileForm, DisplayItem } from "./form";

export default function UserProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [editing, setEditing] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    // Success message state
    const [showSuccess, setShowSuccess] = useState(
        searchParams.get("success") === "1" ||
        searchParams.get("success") === "agent-application"
    );

    useEffect(() => {
        // Fetch user data on the client side
        const fetchUser = async () => {
            const response = await fetch("/api/user/profile");
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                router.push("/");
            }
        };

        fetchUser();
    }, [router]);

    useEffect(() => {
        if (showSuccess) {
            const timeout = setTimeout(() => {
                setShowSuccess(false);
                const params = new URLSearchParams(window.location.search);
                params.delete("success");
                router.replace(
                    `/user/profile${params.toString() ? "?" + params.toString() : ""}`
                );
            }, 7000); // Show for 10 seconds
            return () => clearTimeout(timeout);
        }
    }, [showSuccess, router]);

    if (!user) {
        return <div>Loading...</div>;
    }

    if (editing) {
        return (
            <EditableProfileForm
                user={user}
                sessionEmail={user.email}
                onCancel={() => setEditing(false)}
            />
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-6 mt-12">
            <h1 className="text-4xl font-extrabold text-gray-900">Your Profile</h1>

            {showSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-green-100 border border-green-300 text-green-800 flex justify-between items-center">
                    <span>
                      {searchParams.get("success") === "agent-application"
                        ? "Your application has been submitted! We'll review it and contact you soon."
                        : "Profile updated successfully!"}
                    </span>
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
                        <DisplayItem label="Phone" value={user.agent.phone} />
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

            {/* Apply to Become an Agent section in a card */}
            <div className="bg-white p-8 rounded-2xl shadow space-y-4 mt-8">
                <h2 className="text-2xl font-semibold mb-2">
                    Apply to Become an Agent
                </h2>
                <Button
                    onClick={() => router.push("/agent/apply")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    Apply
                </Button>
            </div>
        </div>
    );
}
