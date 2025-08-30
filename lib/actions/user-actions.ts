"use server";

import { auth } from "../auth";
import { prisma } from "../db/prisma";
import { AgentWithUser, NormalUser } from "@/app/utils/constant";
import {
	
	AgentProfileSchema,

} from "../schemas/userSchema";
import z from "zod";
import { revalidatePath } from "next/cache";

export type AgentResult =
	| { status: "success"; data: AgentWithUser }
	| { status: "unauthorized" }
	| { status: "not_found" }
	| { status: "no_session" }
	| { status: "error"; message: string };

export type UserResult =
	| { status: "success"; data: NormalUser }
	| { status: "unauthorized" }
	| { status: "not_found" }
	| { status: "no_session" }
	| { status: "error"; message: string };

export async function getUserAgent(id: string): Promise<AgentResult> {
	try {
		const session = await auth();

		if (!session) return { status: "no_session" };
		if (session.user.role !== "AGENT") return { status: "unauthorized" };

		const agent = await prisma.agent.findUnique({
			where: { userId: id },
			include: { user: true },
		});

		if (!agent) return { status: "not_found" };

		const { ...safeUser } = agent.user;

		return {
			status: "success",
			data: {
				...agent,
				user: safeUser,
			},
		};
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error(error);
		return {
			status: "error",
			message: "Something went wrong",
		};
	}
}

export async function getUser(): Promise<UserResult> {
	try {
		const session = await auth();
		if (!session) return { status: "unauthorized" };

		const user = await prisma.user.findUnique({
			where: {
				id: session.user.id,
			},
			include: {
				agent: true,
			},

			omit: {
				password: true,
				stripeCustomerId: true,
			},
		});
	
		if (!user) return { status: "not_found" };
		else {
			return {
				status: "success",
				data: user,
			};
		}
	} catch {
		return {
			status: "error",
			message: "Something went wrong",
		};
	}
}

export async function UpdateUserAgent(
	data: z.infer<typeof AgentProfileSchema>
) {
	try {
		const session = await auth();

		if (!session) return { status: "no_session" };
		if (session.user.role !== "AGENT") return { status: "unauthorized" };
		const validatedData = AgentProfileSchema.parse(data);
		if (!validatedData) return { status: "Error Validation" };
		const agent = await prisma.user.update({
			where: { id: session.user.id },
			data: {
				about: validatedData.about,
				name: validatedData.firstName,
				email: validatedData.email,
				agent: {
					update: {
						address: validatedData.address,
						country: validatedData.country,
						dateOfBirth: validatedData.dateOfBirth,
						fullName: validatedData.firstName.concat(
							" ",
							validatedData.lastName
						),
						locality: validatedData.locality,
						phone: validatedData.phone,
						nationalId: validatedData.nationalIdNumber,
					},
				},
			},
		});

		if (!agent) return { status: "not_found" };

		revalidatePath("");
	} catch (error: unknown) {
		console.error(error);
		return {
			status: "error",
			message: "Something went wrong",
		};
	}
}
