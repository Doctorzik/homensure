import { prisma } from "@/lib/db/prisma";
import { stripe } from "@/lib/stripe";

import { headers } from "next/headers";
import Stripe from "stripe";

export async function Post(req: Request) {
	// get the body of the request object
	const body = await req.text();
	console.log(body);

	// get the headerslist fron the headers
	const headerList = await headers();
	console.log(headerList);

	// get the stripe signature from the headers

	const stripeSignature = headerList.get("stripe-signature");

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			stripeSignature as string,
			process.env.STRIPE_WEBHOOK_SECRET as string
		);
	} catch {
		return new Response("Webhook error", { status: 400 });
	}

	const stripeWebHookSession = event.data.object as Stripe.Checkout.Session;

	if (event.type === "checkout.session.completed") {
		const customerId = stripeWebHookSession.customer;
		const propertyId = stripeWebHookSession.metadata?.propertyId;

		if (!propertyId) {
			return new Response("No Property Id found", { status: 404 });
		}

		const customer = await prisma.user.findUnique({
			where: {
				stripeCustomerId: customerId as string,
			},
			include: {
				agent: true,
			},
		});

		if (!customer) {
			return new Response("No customer found for this user");
		}
		const property = await prisma.property.update({
			where: {
				id: propertyId,
				agentId: customer.agent?.id,
			},
			data: {
				status: "ACTIVE",
			},
		});
		console.log("me");
		if (!property) {
			return new Response("No property was found");
		}
		console.log("ue");
		return new Response("null", { status: 200 });
	}
}
