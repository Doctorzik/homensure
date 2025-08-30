import { inngest } from "@/ingest/client";
import { handlePropertyExpiration, helloWorld } from "@/app/api/ingest/functions";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [helloWorld, handlePropertyExpiration],
});
