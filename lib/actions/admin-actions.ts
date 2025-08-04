"use server";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { prisma } from "../db/prisma";
import { getUser } from "./auth-action";

export async function isAdmin(email: string) {
	const user = await prisma.user.findUnique({
		where: { email },
		select: { role: true },
	});

	return user?.role === "ADMIN";
}

export async function isAgent(email: string) {
	const user = await prisma.user.findUnique({
		where: { email },
		select: { role: true },
	});

	return user?.role === "AGENT";
}

export async function isUser(email: string) {
	const user = await prisma.user.findUnique({
		where: { email },
		select: { role: true },
	});

	return user?.role === "USER";
}
export async function getAllApplications() {
	const session = await auth();
	if (!session) {
		throw new Error("Log in to access this page");
	}
	const user = await getUser(session?.user.email as string);

	if (!user || user.role !== "ADMIN") {
		throw new Error("Unauthorize Access");
	}

	const applications = await prisma.agentApplication.findMany({
		include: {
			user: {
				select: {
					image: true,
					name: true,
					id: true,
					email: true,
				},
			},
		},
		omit: {
			interviewDate: true,
			reviewerNote: true,
		},
	});

	if (!applications) {
		throw new Error("Something Happend when fetching applications");
	}

	return applications;
}

export async function approveAgent(agentApplicationId: string) {
	// get a single application approve, then update the role to agent.

	const agent = await prisma.user.update({
		where: {
			id: agentApplicationId,
		},
		data: {
			role: "AGENT",
			AgentApplication: {
				update: {
					status: {
						set: "APPROVED",
					},
				},
			},
		},
	});

	if (!agent) {
		throw new Error("NO USER WITH SUCH AGENT APPLICATION");
	}

	revalidatePath("/system/agentapplications");
}

export async function getSingleApplication(applicationId: string) {
	const application = await prisma.agentApplication.findUnique({
		where: {
			id: applicationId,
		},
		include: {
			user: {
				omit: {
					password: true,
					updatedAt: true,
					emailVerified: true,
					createdAt: true,
				},
			},
		},
	});
	if (!application) {
		throw new Error("Application not found");
	}
	return application;
}
