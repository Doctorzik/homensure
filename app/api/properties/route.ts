// app/api/properties/route.ts

import { prisma } from "@/lib/db/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);

		// Extract query parameters
		const q = searchParams.get("q");
		const city = searchParams.get("city");
		const state = searchParams.get("state");
		const country = searchParams.get("country");
		const type = searchParams.get("type");
		const minPrice = searchParams.get("minPrice");
		const maxPrice = searchParams.get("maxPrice");
		const tags = searchParams.getAll("tags"); // tags[]=tag1&tags[]=tag2
		const available = searchParams.get("available");
		const published = searchParams.get("published");
		const bedrooms = searchParams.get("bedrooms");
		const bathrooms = searchParams.get("bathrooms");
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const sortBy = searchParams.get("sortBy") || "listedAt";
		const order = searchParams.get("order") === "asc" ? "asc" : "desc";

		const skip = (page - 1) * limit;

		// Build filters
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const filters: any = {
			published: published === "true",
			available: available === "true",
			city: city ? { contains: city, mode: "insensitive" } : undefined,
			state: state ? { contains: state, mode: "insensitive" } : undefined,
			country: country ? { contains: country, mode: "insensitive" } : undefined,
			propertyType: type || undefined,
			price: {
				gte: minPrice ? parseFloat(minPrice) : undefined,
				lte: maxPrice ? parseFloat(maxPrice) : undefined,
			},
			bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
			bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
			tags: tags.length > 0 ? { hasSome: tags } : undefined,
			OR: q
				? [
						{ title: { contains: q, mode: "insensitive" } },
						{ description: { contains: q, mode: "insensitive" } },
				  ]
				: undefined,
		};

		// Remove undefined fields
		Object.keys(filters).forEach((key) => {
			if (filters[key] === undefined) delete filters[key];
		});

		const properties = await prisma.property.findMany({
			where: filters,
			skip,
			take: limit,
			orderBy: {
				[sortBy]: order,
			},
			include: {
				agent: true,
				amenities: true,
				reviews: true,
			},
		});

		const total = await prisma.property.count({ where: filters });

		return Response.json({
			data: properties,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Search API error:", error);
		return new Response("Internal server error", { status: 500 });
	}
}
