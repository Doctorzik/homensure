"use client";
import React, { useState, useTransition } from "react";

export default function PendingApplicationsTable({ initialPendingApps, approveApplication, rejectApplication }) {
  const [pendingApps, setPendingApps] = useState(initialPendingApps);
  const [isPending, startTransition] = useTransition();

  async function handleAction(id, action) {
    // Optimistically remove the application from the table
    setPendingApps(prev => prev.filter(app => app.id !== id));
    startTransition(async () => {
      if (action === "approve") {
        await approveApplication(id);
      } else {
        await rejectApplication(id);
      }
      // Re-fetch pending applications for consistency
      const res = await fetch("/api/pending-applications");
      const data = await res.json();
      setPendingApps(data);
    });
  }

  if (pendingApps.length === 0) {
    return <p className="text-gray-600">No pending applications.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border text-xs md:text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-1 py-2 border">Name</th>
            <th className="px-1 py-2 border">Email</th>
            <th className="px-1 py-2 border">Phone</th>
            <th className="px-1 py-2 border">Date of Birth</th>
            <th className="px-1 py-2 border">Gender</th>
            <th className="px-1 py-2 border">National ID</th>
            <th className="px-1 py-2 border">Proof of ID</th>
            <th className="px-1 py-2 border">Address</th>
            <th className="px-1 py-2 border">Video</th>
            <th className="px-1 py-2 border">Desired Locality</th>
            <th className="px-1 py-2 border">Experience</th>
            <th className="px-1 py-2 border">Motivation</th>
            <th className="px-1 py-2 border">Past Roles</th>
            <th className="px-1 py-2 border">Applied At</th>
            <th className="px-1 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingApps.map(app => (
            <tr key={app.id} className="odd:bg-gray-50">
              <td className="px-1 py-2 border whitespace-nowrap">{app.firstName} {app.lastName}</td>
              <td className="px-1 py-2 border whitespace-nowrap">{app.user?.email}</td>
              <td className="px-1 py-2 border whitespace-nowrap">{app.phone}</td>
              <td className="px-1 py-2 border whitespace-nowrap">{new Date(app.dateOfBirth).toLocaleDateString()}</td>
              <td className="px-1 py-2 border whitespace-nowrap">{app.gender}</td>
              <td className="px-1 py-2 border whitespace-nowrap">{app.nationalIdNumber}</td>
              <td className="px-1 py-2 border whitespace-nowrap">
                <a href={app.proofOfIdentityUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {app.proofOfIdentityType?.toUpperCase() || "File"}
                </a>
              </td>
              <td className="px-1 py-2 border whitespace-nowrap">{app.address}</td>
              <td className="px-1 py-2 border whitespace-nowrap">
                <a href={app.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Video</a>
              </td>
              <td className="px-1 py-2 border whitespace-nowrap">{app.desiredLocality}</td>
              <td className="px-1 py-2 border whitespace-nowrap">{app.experience ?? "-"}</td>
              <td className="px-1 py-2 border whitespace-nowrap">{app.motivation}</td>
              <td className="px-1 py-2 border whitespace-nowrap">{app.pastRoles ?? "-"}</td>
              <td className="px-1 py-2 border whitespace-nowrap">{new Date(app.appliedAt).toLocaleString()}</td>
              <td className="px-1 py-2 border whitespace-nowrap">
                {app.status === "PENDING" && (
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      className="w-full bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs md:text-sm"
                      disabled={isPending}
                      onClick={() => handleAction(app.id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="w-full bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs md:text-sm"
                      disabled={isPending}
                      onClick={() => handleAction(app.id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
