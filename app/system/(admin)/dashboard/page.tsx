import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "ADMIN") {
    redirect("/"); // Not an admin, redirect to home or 404
  }

  return (
    <main className="max-w-4xl mx-auto p-8 space-y-6 mt-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="bg-white p-8 rounded-2xl shadow space-y-4">
        <p>Welcome, {session.user.name || session.user.email}!</p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <a href="/system/agentapplications" className="text-blue-600 hover:underline">
              Review Agent Applications
            </a>
          </li>
          {/* Add more admin links here */}
        </ul>
      </div>
    </main>
  );
}