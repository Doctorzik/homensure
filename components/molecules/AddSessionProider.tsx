"use client"


import { SessionProvider } from "next-auth/react";
import { AddPropertyPage } from "./AddProperty";

export default function AddPropeT() {
  return (
    <SessionProvider>
      <AddPropertyPage />
    </SessionProvider>
  );
}
