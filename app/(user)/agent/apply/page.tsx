// File: app/(agent)/agent/apply/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ApplyAgentPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		setLoading(true);

		const formData = new FormData(e.currentTarget);

		// 1. Upload the file and get URL/type
		const file = fileInputRef.current?.files?.[0];
		if (!file) {
		setError("Proof of identity file is required.");
		setLoading(false);
		return;
		}

		// Example: Upload file to /api/upload (you must implement this endpoint)
		const uploadData = new FormData();
		uploadData.append("file", file);

		let proofOfIdentityUrl = "";
		let proofOfIdentityType = "";

		try {
		const uploadRes = await fetch("/api/upload", {
			method: "POST",
			body: uploadData,
		});
		if (!uploadRes.ok) throw new Error("File upload failed");
		const uploadJson = await uploadRes.json();
		proofOfIdentityUrl = uploadJson.url;
		proofOfIdentityType = file.name.split(".").pop()?.toLowerCase() || "";
		} catch {
		setError("Failed to upload proof of identity file.");
		setLoading(false);
		return;
		}

		// 2. Prepare data for agentapplication API
		formData.delete("proofOfIdentity"); // Remove file
		formData.append("proofOfIdentityUrl", proofOfIdentityUrl);
		formData.append("proofOfIdentityType", proofOfIdentityType);

		try {
		const res = await fetch("/api/agentapplication", {
			method: "POST",
			body: formData,
		});

		if (res.ok) {
			router.push("/user/profile?success=agent-application");
			return;
		} else {
			const body = await res.json().catch(() => ({}));
			setError(body.error || "Submission failed. Try again.");
		}
		} catch {
		setError("Network error. Try again.");
		} finally {
		setLoading(false);
		}
	}

	return (
		<div className="max-w-2xl mx-auto p-8 space-y-6 mt-12">
		<h1 className="text-3xl font-extrabold">Apply to Become an Agent</h1>

		{success && (
			<div className="p-4 bg-green-100 text-green-800 rounded font-semibold">
			{success}
			</div>
		)}
		{error && <div className="p-4 bg-red-100 text-red-800 rounded">{error}</div>}

		<form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
			<div>
			<label className="block font-medium">First Name *</label>
			<Input name="firstName" label="First Name" required />
			</div>
			<div>
			<label className="block font-medium">Last Name *</label>
			<Input name="lastName" label="Last Name" required />
			</div>
			<div>
			<label className="block font-medium">Phone *</label>
