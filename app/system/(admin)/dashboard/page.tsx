

import React, { ReactElement } from "react";
import UsersTableWrapper from "@/components/UsersTableWrapper";
import PendingApplicationsTable from "./PendingApplicationsTable";
import { Role } from "@prisma/client";

// ...existing code...

async function rejectApplication(id: string): Promise<void> {
  "use server";
  await prisma.agentApplication.update({
    where: { id },
    data: { status: "REJECTED" },
  });
  // Optionally trigger a refresh if needed (handled by client)
}

async function updateUser(formData: FormData): Promise<void> {
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

async function deleteUser(id: string): Promise<void> {
  "use server";
  await prisma.user.delete({ where: { id } });
}

export default async function AdminDashboard(): Promise<ReactElement> {
  const pendingAppsRaw = await prisma.agentApplication.findMany({
    where: { status: "PENDING" },
    include: { user: true },
    orderBy: { appliedAt: "desc" },
  });
  // Ensure phone is string for PendingApp compatibility
  const pendingApps = pendingAppsRaw.map(app => ({
    ...app,
    phone: String(app.phone),
    experience: app.experience === null ? undefined : app.experience,
    pastRoles: app.pastRoles === null ? undefined : app.pastRoles,
  }));
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
        <PendingApplicationsTable
          initialPendingApps={pendingApps}
          approveApplication={approveApplication}
          rejectApplication={rejectApplication}
        />
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


export async function approveApplication(id: string): Promise<void> {
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
  // Optionally trigger a refresh if needed (handled by client)
}