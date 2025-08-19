import { prisma } from "@/lib/db/prisma";
import { createHmac } from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
const secret = process.env.PAY_STACK_SECRET!;

export async function POST(req: Request) {
	const rawBody = await req.text();
	const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
	const headerList = await headers();
  
	if (hash !== headerList.get("x-paystack-signature")) {
		return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
	} else {
		const webhookEvents = JSON.parse(rawBody);

		const { event, data } = webhookEvents;

		if (event === "charge.success"){

			await prisma.property.update({
				where: {
					id: data.metadata.propertyId,
				},
				data: {
					status: "ACTIVE",
				},
			});

		}
		return NextResponse.json(
			{ success: "Signature is valid" },
			{ status: 200 }
		);
	
	
	}
}
