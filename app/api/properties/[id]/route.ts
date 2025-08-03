export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { agent: true },
    });
    if (!user?.agent?.id) {
      return new Response("Agent profile not found", { status: 403 });
    }
    const id = params.id;
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property || property.agentId !== user.agent.id) {
      return new Response("Forbidden", { status: 403 });
    }
    return NextResponse.json({ property });
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { agent: true },
    });
    if (!user?.agent?.id) {
      return new Response("Agent profile not found", { status: 403 });
    }
    const id = params.id;
    const body = await req.json();
    // Only allow update if property belongs to this agent
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property || property.agentId !== user.agent.id) {
      return new Response("Forbidden", { status: 403 });
    }
    const updated = await prisma.property.update({
      where: { id },
      data: body,
    });
    return NextResponse.json({ property: updated });
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { agent: true },
    });
    if (!user?.agent?.id) {
      return new Response("Agent profile not found", { status: 403 });
    }
    const id = params.id;
    // Only allow delete if property belongs to this agent
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property || property.agentId !== user.agent.id) {
      return new Response("Forbidden", { status: 403 });
    }
    await prisma.property.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
}
