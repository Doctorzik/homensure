// File: app/(agent)/agent/apply/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ApplyAgentPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/agentapplication", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Application submitted for review.");
        router.push("/user/profile");
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

      {error && <div className="p-4 bg-red-100 text-red-800 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* …all your inputs as before… */}
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting…" : "Submit Application"}
        </Button>
      </form>
    </div>
  );
}
