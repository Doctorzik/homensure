// File: app/(user)/userprofile/page.tsx

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { ProfileWithToggle } from "./form";

export default async function UserProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { agent: true },
  });

  if (!user) {
    redirect("/");
  }

  // Serialize Dates to ISO strings for Client Components
  const safeUser = {
    ...user,
    createdAt: user.createdAt?.toISOString() ?? null,
    updatedAt: user.updatedAt?.toISOString() ?? null,
    emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
    agent: user.agent ? { ...user.agent } : null,
  };

  return <ProfileWithToggle user={safeUser} sessionEmail={session.user.email} />;
}
