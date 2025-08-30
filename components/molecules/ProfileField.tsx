import { ReactElement } from "react";

interface iAppProps {
  label: string | ReactElement | null,
  value: string | ReactElement | null
}

export function ProfileField({ label, value }: iAppProps) {
  return (
    <div className="flex justify-between items-baseline">
      <p className="">{label}</p>
      <p className="text-base font-medium px-3">{value}</p>
    </div>
  );
}

export function formatDate(date: Date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}