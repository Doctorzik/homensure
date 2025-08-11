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
			<Input name="firstName" required label="First Name *" />
			</div>
			<div>
			<Input name="lastName" required label="Last Name *" />
			</div>
			<div>
			<Input name="phone" type="tel" required label="Phone *" />
			</div>
			<div>
			<Input name="dateOfBirth" type="date" required label="Date of Birth *" />
			</div>
			<div>
			<label className="block font-medium">Gender *</label>
			<select name="gender" required className="w-full border rounded px-2 py-1">
				<option value="">Select</option>
				<option value="MALE">Male</option>
				<option value="FEMALE">Female</option>
			</select>
			</div>
			<div>
			<Input name="nationalIdNumber" required label="National ID Number *" />
			</div>
			<div>
			<label className="block font-medium">Proof of Identity (PDF/JPG) *</label>
			<input
				name="proofOfIdentity"
				type="file"
				accept=".pdf,.jpg,.jpeg,.png"
				required
				ref={fileInputRef}
				className="w-full border rounded px-2 py-1"
			/>
			</div>
			<div>
			<Input name="address" required label="Address *" />
			</div>
			<div>
			<Input name="videoUrl" type="url" required label="Video Introduction URL *" />
			</div>
			<div>
			<Input name="desiredLocality" required label="Desired Locality *" />
			</div>
			<div>
			<Input name="experience" type="number" min={0} required label="Experience (years) *" />
			</div>
			<div>
			<label className="block font-medium">Motivation *</label>
			<textarea name="motivation" required className="w-full border rounded px-2 py-1" />
			</div>
			<div>
			<Input name="pastRoles" label="Past Roles (optional)" />
			</div>

			{/* Show duplicate application error above the button */}
			{error === "You have already submitted an application. Please wait for review." && (
				<div className="p-3 mb-2 bg-yellow-100 text-yellow-800 rounded font-semibold text-center">
					{error}
				</div>
			)}

			<div className="flex gap-4">
				<Button
					type="submit"
					disabled={loading}
					className="text-white"
				>
					{loading ? "Submitting…" : "Submit Application"}
				</Button>
				<Button
					type="button"
					variant="outline"
					disabled={loading}
					onClick={() => router.push("/user/profile")}
				>
					Cancel
				</Button>
			</div>

			{/* Show other errors below the button */}
			{error && error !== "You have already submitted an application. Please wait for review." && (
				<div className="p-3 mt-2 bg-red-100 text-red-800 rounded font-semibold text-center">
					{error}
				</div>
			)}
		</form>
		</div>
	);
}