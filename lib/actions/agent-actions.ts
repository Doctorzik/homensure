import { auth } from "@/lib/auth";
import { agentApplicationSchema } from "@/lib/schemas/userSchema";
import z from "zod";
import { prisma } from "../db/prisma";
import { getUser } from "./auth-action";

import { redirect } from "next/navigation";

export async function createAgentApplication(
	data: z.infer<typeof agentApplicationSchema>
) {
	// Ensure that the user is logged in
	const session = await auth();
	if (!session) {
		throw new Error("No user found");
	}

	// Validate the agent application schema
	const validateData = agentApplicationSchema.parse(data);
	if (!validateData) return new Error("Invalid form Data");

	const user = await getUser(session.user?.email as string);
	if (!user) return new Error("No user found");

	// create a mutation
	const application = await prisma.agentApplication.create({
		data: {
			address: validateData.address,
			dateOfBirth: validateData.dateOfBirth,
			desiredLocality: validateData.desiredLocality,
			firstName: validateData.firstName,
			gender: validateData.gender,
			lastName: validateData.lastName,
			motivation: validateData.motivation,
			nationalIdNumber: validateData.nationalIdNumber,
			phone: validateData.phoneNumber,
			proofOfIdentityType: validateData.proofOfIdentityFile,
			proofOfIdentityUrl: validateData.proofOfIdentityFile,
			videoUrl: validateData.videoUrl,
			experience: validateData.experience,
			userId: user.id as string,
		},
		select: {
			id: true,
		},
	});
	if (!application) {
		throw new Error("Something happened  during the submission process");
	}
	redirect("/");
}


