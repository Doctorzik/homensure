"use client";
import React from "react";
import DeleteUserButton from "./DeleteUserButton";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  emailVerified?: string | null;
};

export default function UsersEditableTable({ users, updateUser, deleteUser }: {
  users: UserRow[];
  updateUser: (formData: FormData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}) {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValues, setEditValues] = React.useState<Record<string, { name: string; email: string; role: string }>>({});

  const handleEdit = (user: UserRow) => {
    setEditingId(user.id);
    setEditValues((prev) => ({ ...prev, [user.id]: { name: user.name, email: user.email, role: user.role } }));
  };
  const handleCancel = () => setEditingId(null);
  const handleChange = (id: string, field: string, value: string) => {
    setEditValues((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  return (
    <table className="w-full border text-xs md:text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-2 py-2 border">Name</th>
          <th className="px-2 py-2 border">Email</th>
          <th className="px-2 py-2 border">Role</th>
          <th className="px-2 py-2 border">Created</th>
          <th className="px-2 py-2 border">Email Verified</th>
          <th className="px-2 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} className="even:bg-gray-50">
            <td className="px-2 py-2 border whitespace-nowrap text-center">
              {editingId === user.id ? (
                <input
                  className="border rounded px-1 py-0.5 w-32"
                  value={editValues[user.id]?.name ?? user.name}
                  onChange={e => handleChange(user.id, "name", e.target.value)}
                />
              ) : user.name}
            </td>
            <td className="px-2 py-2 border whitespace-nowrap">
              {editingId === user.id ? (
                <input
                  className="border rounded px-1 py-0.5 w-40"
                  value={editValues[user.id]?.email ?? user.email}
                  onChange={e => handleChange(user.id, "email", e.target.value)}
                />
              ) : user.email}
            </td>
            <td className="px-2 py-2 border whitespace-nowrap">
              {editingId === user.id ? (
                <select
                  className="border rounded px-1 py-0.5"
                  value={editValues[user.id]?.role ?? user.role}
                  onChange={e => handleChange(user.id, "role", e.target.value)}
                >
                  <option value="USER">USER</option>
                  <option value="AGENT">AGENT</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              ) : user.role}
            </td>
            <td className="px-2 py-2 border whitespace-nowrap text-center">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
            </td>
            <td className="px-2 py-2 border whitespace-nowrap text-center">
              {user.emailVerified ? (
                <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs">Yes</span>
              ) : (
                <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs">No</span>
              )}
            </td>
            <td className="px-2 py-2 border whitespace-nowrap">
              {editingId === user.id ? (
                <form
                  action={async (formData: FormData) => {
                    await updateUser(formData);
                    setEditingId(null);
                  }}
                  method="post"
                  className="flex gap-2 justify-center"
                >
                  <input type="hidden" name="id" value={user.id} />
                  <input type="hidden" name="name" value={editValues[user.id]?.name ?? user.name} />
                  <input type="hidden" name="email" value={editValues[user.id]?.email ?? user.email} />
                  <input type="hidden" name="role" value={editValues[user.id]?.role ?? user.role} />
                  <button type="submit" className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs">Save</button>
                  <button type="button" className="bg-gray-400 text-white px-2 py-1 rounded text-xs" onClick={handleCancel}>Cancel</button>
                </form>
              ) : (
                <div className="flex flex-row gap-6 justify-center items-center">
                  <button className="bg-blue-600 text-white px-6 py-1 rounded hover:bg-blue-700 text-xs" onClick={() => handleEdit(user)}>Edit</button>
                  <span className="h-5 w-px bg-gray-300 mx-1" />
                  <DeleteUserButton userId={user.id} userName={user.name} deleteUser={deleteUser} setEditingId={setEditingId} />
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
