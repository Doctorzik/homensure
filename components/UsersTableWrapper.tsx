"use client";
import dynamic from "next/dynamic";
import React, { useTransition } from "react";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
};


const UsersEditableTable = dynamic(() => import("@/components/UsersEditableTable"));

export default function UsersTableWrapper({ users, updateUser, deleteUser }: {
  users: UserRow[];
  updateUser: (formData: FormData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const [localUsers, setLocalUsers] = React.useState(users);

  React.useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const handleUpdateUser = async (formData: FormData) => {
    await updateUser(formData);
    startTransition(() => {
      window.location.reload();
    });
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id);
    startTransition(() => {
      window.location.reload();
    });
  };

  return (
    <UsersEditableTable users={localUsers} updateUser={handleUpdateUser} deleteUser={handleDeleteUser} />
  );
}
