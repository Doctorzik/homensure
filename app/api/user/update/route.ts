// File: app/api/user/update/route.ts

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const image = formData.get("image") as string;
  const password = formData.get("password") as string;
  const agentAddress = formData.get("agentAddress") as string;

  try {
    const data: any = {
      name,
      email,
      image,
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    if (agentAddress) {
      data.agent = {
        upsert: {
          create: { address: agentAddress },
          update: { address: agentAddress },
        },
      };
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
