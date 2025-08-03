// Type guard for Prisma error
function isPrismaP2002Error(err: unknown): err is { code: string; meta?: { target?: string[] } } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: unknown }).code === "P2002" &&
    "meta" in err &&
    Array.isArray((err as { meta?: { target?: unknown } }).meta?.target)
  );
}
// File: app/api/agentapplication/route.ts

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { Gender } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // 1) guard
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized – please log in first." },
      { status: 401 }
    );
  }

  // 2) pull FormData
  const formData = await req.formData();
  const firstName           = formData.get("firstName") as string;
  const lastName            = formData.get("lastName") as string;
  const phoneStr            = formData.get("phone") as string;
  const dateOfBirthStr      = formData.get("dateOfBirth") as string;
  const gender              = formData.get("gender") as string;
  const nationalIdNumber    = formData.get("nationalIdNumber") as string;
  const proofOfIdentityUrl  = formData.get("proofOfIdentityUrl") as string;
  const proofOfIdentityType = formData.get("proofOfIdentityType") as string;
  const address             = formData.get("address") as string;
  const videoUrl            = formData.get("videoUrl") as string;
  const desiredLocality     = formData.get("desiredLocality") as string;
  const experienceStr       = formData.get("experience") as string;
  const motivation          = formData.get("motivation") as string;
  const pastRoles           = formData.get("pastRoles") as string;

  // 3) find the user record
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json(
      { error: "User account not found." },
      { status: 404 }
    );
  }

  try {
    await prisma.agentApplication.create({
      data: {
        userId:            user.id,
        firstName,
        lastName,
        phone:             parseInt(phoneStr, 10),
        dateOfBirth:       new Date(dateOfBirthStr),
        gender: gender as Gender,
        nationalIdNumber,
        proofOfIdentityUrl,
        proofOfIdentityType,
        address,
        videoUrl,
        desiredLocality,
        experience:        experienceStr ? parseInt(experienceStr, 10) : undefined,
        motivation,
        pastRoles:         pastRoles || undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (isPrismaP2002Error(err) && err.meta?.target?.includes("userId")) {
      return NextResponse.json(
        { error: "You have already submitted an application. Please wait for review." },
        { status: 400 }
      );
    }
    console.error("AgentApplication error:", err);
    return NextResponse.json(
      { error: "Failed to submit application." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { agent: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
