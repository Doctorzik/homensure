import { ReactElement } from "react";

interface iAppProps {
  label: string | ReactElement | null,
  value: string | ReactElement | null
}

export function ProfileField({ label, value }: iAppProps) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium">{value || "N/A"}</p>
    </div>
  );
}

export function formatDate(date: Date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}