"use server";

import { auth } from "@/lib/auth";
import {
	agentApplicationSchema,
	propertySchema,
} from "@/lib/schemas/userSchema";
import z from "zod";
import { prisma } from "../db/prisma";
import { getUser } from "./auth-action";

import { redirect } from "next/navigation";
import { isAgent } from "./admin-actions";

import { propertyListingDurationPrice } from "@/app/utils/constant";
import { revalidatePath } from "next/cache";

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
	const getapplication = await prisma.agentApplication.findUnique({
		where: {
			userId: user.id,
		},

		select: {
			id: true,
		},
	});
	if (getapplication) {
		return {
			success: true,
			message: "You already submitted an application...",
		};
	}
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
			phone: validateData.phoneNumber.toString(),
			proofOfIdentityType: validateData.proofOfIdentityFile,
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

export async function createProperty(
	data: z.infer<typeof propertySchema>,
	agentEmail: string
) {
	const session = await auth();
	if (!session) throw new Error("Log in to access this page");

	if (session.user.email !== agentEmail)
		throw new Error(
			"You are not authorized to create a property for this agent"
		);

	const isThisAnagent = await isAgent(agentEmail);

	if (!isThisAnagent)
		throw new Error("Only agents are allowed to create a property listing");

	const validated = propertySchema.parse(data);

	const agentInfo = await prisma.user.findUnique({
		where: { email: agentEmail },
		select: {
			id: true,
			email: true,
			stripeCustomerId: true,
			agent: {
				select: {
					id: true,
					user: {
						select: { name: true },
					},
				},
			},
		},
	});

	if (!agentInfo) redirect("/");
	// let agentStripeId = agentInfo.stripeCustomerId;
	// if (!agentStripeId) {
	// 	const customer = await stripe.customers.create({
	// 		name: agentInfo.agent?.user.name as string,
	// 		email: agentInfo.email,
	// 	});
	// 	agentStripeId = customer.id;
	// 	await prisma.user.update({
	// 		where: { id: agentInfo.id },
	// 		data: { stripeCustomerId: agentStripeId },
	// 	});
	// }

	const property = await prisma.property.create({
		data: {
			...validated,
			listingDuration: validated.listingDuration,
			agentId: agentInfo.agent?.id as string,
		},
		select: {
			id: true,
			agent: {
				select: {
					user: {
						select: {
							email: true,
						},
					},
				},
			},
		},
	});

	const pricingTier = propertyListingDurationPrice.find(
		(tier) => tier.days === validated.listingDuration
	);
	if (!pricingTier) throw new Error("Invalid Pricing Tier");

	// const stripeSession = await stripe.checkout.sessions.create({
	// 	customer: agentStripeId,
	// 	line_items: [
	// 		{
	// 			price_data: {
	// 				product_data: {
	// 					name: `Property Listing for ${pricingTier.days} days`,
	// 					description: pricingTier.description,
	// 					images: ["https://picsum.photos/200"],
	// 				},
	// 				unit_amount: pricingTier.price * 100,
	// 				currency: "NGN",
	// 			},
	// 			quantity: 1,
	// 		},
	// 	],
	// 	metadata: {
	// 		propertyId: property.id,
	// 	},
	// 	success_url: `${process.env.NEXT_PUBLIC_URL}/user/agent/payment/success`,
	// 	cancel_url: `${process.env.NEXT_PUBLIC_URL}/user/agent/payment/cancel`,
	// 	mode: "payment",
	// });

	// if (!stripeSession.url)
	// 	throw new Error("Stripe session could not be created");

	// redirect(stripeSession.url);

	if (!property.id) {
		return {
			status: "error",
			message: "failed to create property",
		};
	}

	return {
		status: "success",
		message: "Successfully add property",
		data: {
			id: property.id,
			price: String(pricingTier.price),
			email: property.agent.user.email,
		},
	};
}

export async function editProperty(data: z.infer<typeof propertySchema>) {
	const session = await auth();
	if (!session) {
		throw new Error("Log in to access this page");
	}

	const verifiedProperty = propertySchema.parse(data);

	// Step 1: Check if the property belongs to this user
	const propertyOwnerCheck = await prisma.property.findFirst({
		where: {
			id: verifiedProperty.id,
			agent: {
				user: {
					id: session.user.id,
				},
			},
		},
	});

	if (!propertyOwnerCheck) {
		throw new Error("You are not authorized to edit this property");
	}

	// Step 2: Perform the update
	const updatedProperty = await prisma.property.update({
		where: {
			id: verifiedProperty.id,
		},
		data: {
			...verifiedProperty,
		},
		select: {
			_count: true,
		},
	});

	return updatedProperty;
}

export async function allPropertiesByAgent() {
	const session = await auth();
	if (!session?.user) {
		throw new Error("Log in to access this page");
	}

	const properties = await prisma.property.findMany({
		where: {
			agent: {
				user: {
					id: session.user.id, // Logged-in user ID from session
				},
			},
		},
		orderBy: {
			listedAt: "desc",
		},
	});

	if (properties.length === 0) {
		return [];
	}

	return properties;
}
export async function getSingleAgentProperty(id: string) {
	const session = await auth();
	if (!session?.user) {
		throw new Error("Log in to access this page");
	}
	const property = await prisma.property.findFirst({
		where: {
			id: id,
			agent: {
				user: {
					id: session.user.id, // logged-in user's ID
				},
			},
		},
	});
	if (!property) {
		throw new Error("No property found");
	} else {
		return property;
	}
}

export async function deleteProperty(id: string) {
	const session = await auth();
	if (!session?.user) {
		throw new Error("Log in to access this page");
	}

	// Step 1: Make sure this user owns the property (via agent relation)
	const property = await prisma.property.findFirst({
		where: {
			id: id,
			agent: {
				user: {
					id: session.user.id,
				},
			},
		},
	});

	if (!property) {
		throw new Error("Unauthorized or property not found");
	}

	// Step 2: Delete it
	const deletedProperty = await prisma.property.delete({
		where: {
			id: id,
		},
		select: {
			id: true,
		},
	});

	return deletedProperty;
}

export async function getAllProperties() {
	try {
		const properties = await prisma.property.findMany({
			where: {
				status: "ACTIVE",
			},
			include: {
				agent: true,
			},
			orderBy: {
				listedAt: "desc",
			},
		});

		return properties;
	} catch {
		console.error("Error fetching properties:");
		throw new Error("Failed to fetch properties");
	}
}

export const initializePaystack = async (
	email: string,
	amount: string, // change type to number
	propertyId: string
) => {
	// Convert amount to kobo (smallest unit)

	const response = await fetch(
		"https://api.paystack.co/transaction/initialize",
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.PAY_STACK_SECRET}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				amount: amount,
				reference: propertyId,
				callback_url: `${process.env.NEXT_PUBLIC_URL}/user/agent/payment/success`,
				metadata: {
					propertyId,
					cancel_action: `${process.env.NEXT_PUBLIC_URL}/user/agent/payment/cancel`,
				},
			}),
		}
	);

	const contentType = response.headers.get("content-type") || "";
	if (!contentType.includes("application/json")) {
		throw new Error("Paystack response not JSON");
	}

	const data = await response.json();

	if (!response.ok) {
		console.error("Paystack API error:", data);
		throw new Error(data.message || "Paystack API error");
	}

	return data;
};

export const updateProfileImage = async (url: string, id: string) => {
	const count = await prisma.user.update({
		where: {
			id: id,
		},
		data: {
			image: url,
		},
		select: {
			_count: true,
		},
	});

	if (!count) {
		return false;
	}
  revalidatePath("/user/agent/profile"); 
};
