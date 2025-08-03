

import React from "react";
import UsersTableWrapper from "@/components/UsersTableWrapper";
import { Role } from "@prisma/client";

// ...existing code...

async function rejectApplication(id: string) {
  "use server";
  await prisma.agentApplication.update({
    where: { id },
    data: { status: "REJECTED" },
  });
}

async function updateUser(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;
  await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      role: role as Role, // Use Role enum for type safety
    },
  });
}

async function deleteUser(id: string) {
  "use server";
  await prisma.user.delete({ where: { id } });
}

export default async function AdminDashboard() {
  const pendingApps = await prisma.agentApplication.findMany({
    where: { status: "PENDING" },
    include: { user: true },
    orderBy: { appliedAt: "desc" },
  });
  const usersRaw = await prisma.user.findMany({ orderBy: { name: "asc" } });
  const users = usersRaw.map(u => ({
    id: u.id,
    name: u.name ?? "",
    email: u.email,
    role: u.role,
    createdAt: u.createdAt?.toISOString?.() ?? (typeof u.createdAt === "string" ? u.createdAt : undefined),
    emailVerified: u.emailVerified,
  }));

  return (
    <main className="w-full max-w-[98vw] mx-auto p-1 md:p-4 space-y-6 mt-4">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="bg-white p-1 md:p-3 rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-bold mb-4">Pending Agent Applications</h2>
        {pendingApps.length === 0 ? (
          <p className="text-gray-600">No pending applications.</p>
        ) : (
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
                          <form action={approveApplication.bind(null, app.id)} method="post">
                            <button type="submit" className="w-full bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs md:text-sm">Approve</button>
                          </form>
                          <form action={rejectApplication.bind(null, app.id)} method="post">
                            <button type="submit" className="w-full bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs md:text-sm">Reject</button>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Users List Section */}
      <div className="bg-white p-1 md:p-3 rounded-xl shadow space-y-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">All Users</h2>
        <div className="overflow-x-auto">
          <UsersTableWrapper users={users} updateUser={updateUser} deleteUser={deleteUser} />
        </div>
      </div>
    </main>
  );
}


import { prisma } from "@/lib/db/prisma";


export async function approveApplication(id: string) {
  "use server";
  // 1. Mark application as approved
  const application = await prisma.agentApplication.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  // 2. Update user role to AGENT
  await prisma.user.update({
    where: { id: application.userId },
    data: { role: "AGENT" },
  });

  // 3. Check if Agent already exists for this user
  const existingAgent = await prisma.agent.findUnique({
    where: { userId: application.userId },
  });
  if (!existingAgent) {
    await prisma.agent.create({
      data: {
        userId: application.userId,
        fullName: application.firstName + " " + application.lastName,
        phone: String(application.phone),
        dateOfBirth: application.dateOfBirth,
        gender: application.gender,
        address: application.address,
        locality: application.desiredLocality,
      }
    });
  }
}