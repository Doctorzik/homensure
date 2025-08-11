import React from "react";

type DeleteUserButtonProps = {
  userId: string;
  userName: string;
  deleteUser: (id: string) => Promise<void>;
  setEditingId: (id: string | null) => void;
};

export default function DeleteUserButton({ userId, userName, deleteUser, setEditingId }: DeleteUserButtonProps) {
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleDelete = async () => {
    await deleteUser(userId);
    setEditingId(null);
    setShowConfirm(false);
  };

  return (
    <>
      <button
        className="bg-red-600 text-white px-2 py-1 rounded text-xs"
        onClick={() => setShowConfirm(true)}
      >
        Delete
      </button>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col items-center">
            <p className="mb-4 text-center text-sm">
              Are you sure you want to delete user <span className="font-semibold text-red-700">{userName}</span>?
            </p>
            <div className="flex flex-row gap-10 mt-2">
              <button
                className="bg-red-600 text-white px-4 py-1 rounded text-xs"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-1 rounded text-xs"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
