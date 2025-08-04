import { z } from "zod";

export const propertyTypeEnum = z.enum([
	"APARTMENT",
	"HOUSE",
	"STUDIO",
	"DUPLEX",
	"COMMERCIAL",
	"LAND",
]);
export type PropertyType = z.infer<typeof propertyTypeEnum>;

export const amenitySchema = z.object({
	id: z.cuid().optional(),
	name: z.string().trim().min(1, "Amenity name is required"),
});

export const reviewSchema = z.object({
	id: z.cuid().optional(),
	rating: z.number().min(1).max(5).default(5),
	comment: z.string().optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),

	propertyId: z.string().cuid("Invalid property ID"),
	userId: z.string().cuid("Invalid user ID"),
});

export const userSchema = z.object({
	name: z.string().min(3, "Please enter a better name").optional(),
	email: z.email("Please provide a valid email"),
	password: z.string().min(1, "Please provide a better password"),
});

export const agentApplicationSchema = z.object({
	firstName: z.string().min(3, "Full name must be at least 3 characters"),
	lastName: z.string().min(3, "Full name must be at least 3 characters"),
	phoneNumber: z.number().min(11, "Phone number must be valid"),
	dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	gender: z.enum(["MALE", "FEMALE"]),
	nationalIdNumber: z.string().min(11, "National ID number is required"),
	videoUrl: z.url("Please  input a valid url"),
	proofOfIdentityFile: z
		.any()
		.refine((file) => file instanceof File, {
			message: "Proof of identity must be a file",
		})
		.refine((file) => file.size <= 5 * 1024 * 1024, {
			message: "File size should not exceed 5MB",
		})
		.refine(
			(file) =>
				["image/jpeg", "image/png", "application/pdf"].includes(file.type),
			{
				message: "File must be JPG, PNG, or PDF",
			}
		),
	address: z.string().min(5, "Address is required"),
	desiredLocality: z.string().min(3, "Locality is required"),
	experience: z.number().optional(),
	motivation: z.string().min(30, "Please describe why you want to be an agent"),
	pastRoles: z.string().optional(),
	interviewDate: z.string().optional(), // Usually set by admin later
	reviewerNote: z.string().optional(),
});

export const propertySchema = z.object({
	id: z.cuid().optional(),
	title: z.string().min(3, "Title is required"),
	slug: z.string().min(3, "Slug is required"),
	description: z.string().min(10, "Description is required"),

	images: z
		.array(
			z
				.string()
				.url()
				.refine((url) => /\.(jpe?g|png|webp|svg)$/i.test(url), {
					message: "Must be a valid image URL",
				})
		)
		.min(1)
		.max(10),

	videos: z
		.array(
			z
				.string()
				.url()
				.refine((url) => /\.(mp4|mov|webm)$/i.test(url), {
					message: "Must be a valid video URL",
				})
		)
		.max(5),

	propertyType: propertyTypeEnum,

	bedrooms: z.number().int().min(0),
	bathrooms: z.number().int().min(0),
	area: z.number().positive("Area must be greater than 0"),

	amenities: z.array(amenitySchema).optional(), // many-to-many relationship
	tags: z.array(z.string().min(1)).optional(),

	price: z.number().positive("Price must be greater than 0"),
	furnished: z.boolean().default(false),
	available: z.boolean().default(true),
	isFeatured: z.boolean().default(false),
	published: z.boolean().default(false),
	views: z.number().int().min(0).default(0),

	city: z.string().min(2),
	state: z.string().min(2),
	country: z.string().min(2),
	address: z.string().min(5),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	listingDuration: z
		.number()
		.min(30, "The minimal number of days is 30 for a listing"),

	listedAt: z.date().optional(),
	updatedAt: z.date().optional(),

	agentId: z.cuid("Invalid agent ID"),
});

export const searchSchema = z.object({
	city: z.string().optional(),
	state: z.string().optional(),
	country: z.string().optional(),
	minPrice: z.coerce.number().optional(),
	maxPrice: z.coerce.number().optional(),
	bedrooms: z.coerce.number().optional(),
	bathrooms: z.coerce.number().optional(),
	tags: z.string().optional(), // comma-separated string
	propertyType: z.string().optional(),
	published: z.coerce.boolean().optional(),
});
