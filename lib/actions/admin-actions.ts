"use server";

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
		where: {
			status: "PENDING",
		},
		include: {
			user: {
				omit: {
					password: true,
					stripeCustomerId: true,
				},
			},
		},
		omit: {
			interviewDate: true,
			reviewerNote: true,
		},
		orderBy: {
			appliedAt: "desc",
		},
	});

	if (!applications) {
		throw new Error("Something Happend when fetching applications");
	}

	return applications;
}

export async function approveAgent(agentApplicationId: string) {
	// get a single application approve, then update the role to agent.

	const application = await prisma.agentApplication.findUnique({
		where: {
			id: agentApplicationId,
		},
	});

	if (!application)
		return { success: false, message: "This application was not found" };

	const agent = await prisma.agent.create({
		data: {
			address: application.address,
			dateOfBirth: application.dateOfBirth.toString(),
			fullName: application.firstName + " " + application.lastName,
			gender: application.gender,
			locality: application.gender,
			phone: application.phone,
			id: application.id,
			nationalId: application.nationalIdNumber,
			userId: application.userId,
		},
		select: {
			user: {
				select: {
					id: true,
				},
			},
		},
	});

	if (!agent)
		return {
			success: false,
			messsage: "Something happened while creating agent",
		};

	const updateUserRole = await prisma.user.update({
		where: {
			id: agent.user.id,
		},
		data: {
			role: "AGENT",
			AgentApplication: {
				update: {
					status: "APPROVED",
				},
			},
		},
		select: {
			id: true,
		},
	});


	if (updateUserRole)
		return {
			success: true,
			message: "User Successfully approved to Agent",
		};

	//  revalidatePath("/system/agentapplications");
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
