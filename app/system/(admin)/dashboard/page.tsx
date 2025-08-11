



import { getAllApplications } from "@/lib/actions/admin-actions";

import AgentDecision from "@/components/molecules/AdminAgentApproval";





export default async function AdminDashboard() {

  const agentApllicationList = await getAllApplications()

  return (
    <main className="w-full max-w-[98vw] mx-auto p-1 md:p-4 space-y-6 mt-4">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="bg-white p-1 md:p-3 rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-bold mb-4">Pending Agent Applications</h2>
        {agentApllicationList.length === 0 ? (
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
                  <th className="px-1 py-2 border">Status</th>
                  <th className="px-1 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {agentApllicationList.map((app: any) => (
                  <tr key={app.id} className="odd:bg-gray-50">
                    <td className="px-1 py-2 border whitespace-nowrap">{app.firstName} {app.lastName}</td>
                    <td className="px-1 py-2 border whitespace-nowrap">{app.user?.email}</td>
                    <td className="px-1 py-2 border whitespace-nowrap">{app.phone}</td>
                    <td className="px-1 py-2 border whitespace-nowrap">{new Date(app.dateOfBirth).toLocaleDateString()}</td>
                    <td className="px-1 py-2 border whitespace-nowrap">{app.gender}</td>
                    <td className="px-1 py-2 border whitespace-nowrap">{app.nationalIdNumber}</td>
                    <td className="px-1 py-2 border whitespace-nowrap">
                      <a href={app.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
                    <td className="px-1 py-2 border whitespace-nowrap">{app.status ?? "-"}</td>

                    <td className="px-1 py-2 border whitespace-nowrap">{new Date(app.appliedAt).toLocaleString()}</td>
                    <td className="px-1 py-2 border whitespace-nowrap">
                      {app.status === "PENDING" ? (
                        <AgentDecision id={app.id as string} />
                      )
                        : ""}
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
          {/* <UsersTableWrapper users={users} updateUser={updateUser} deleteUser={deleteUser} /> */}
        </div>
      </div>
    </main>
  );
}




