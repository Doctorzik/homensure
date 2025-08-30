import { inngest } from "@/ingest/client";
import { prisma } from "@/lib/db/prisma";

export const helloWorld = inngest.createFunction(
	{ id: "hello-world" },
	{ event: "test/hello.world" },
	async ({ event, step }) => {
		await step.sleep("wait-a-moment", "1s");
		return { message: `Hello ${event.data.email}!` };
	}
);

export const handlePropertyExpiration = inngest.createFunction(
	{ id: "property-expiration" },
	{ event: "property/created" },

	async ({ step, event }) => {
		const { propertyId, expirationDays } = event.data;

		await step.sleep("wait-for-property-expiration", `${expirationDays}d`);

		await step.run("update-property-status", async () => {
			await prisma.property.update({
				where: {
					id: propertyId,
				},
				data: {
					status: "EXPIRED",
				},
			});
		});

		return {propertyId, message : "property Expired"}
	}
);
