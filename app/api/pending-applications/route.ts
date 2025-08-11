import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const pendingApps = await prisma.agentApplication.findMany({
    where: { status: "PENDING" },
    include: { user: true },
    orderBy: { appliedAt: "desc" },
  });
  return NextResponse.json(pendingApps);
}
