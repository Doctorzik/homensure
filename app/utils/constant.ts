import { User as PrismaUser, Agent as PrismaAgent } from "@prisma/client";

export type User = PrismaUser;

export type NormalUser = Omit<PrismaUser, "password" | "stripeCustomerId">;

export interface AgentWithUser extends PrismaAgent {
	user: Omit<User, "password" | "stripeCustomerId">;
}

export const appUrls = {
	landingPage: "/",
	properties: "/properties",
	userProfile: "/user/profile",
	agentProfile: "/user/agent/profile",
	agentProperties: "/user/agent/properties",
	agentApply: "/user/agent/apply",
	login: {
		landing: "/login",
		register: "/register",
	},
	system: {
		adminLanding: "/system/dashboard",
		agentApplications: "/system/agentapplications",
		applicationReview: "/system/applicationreview",
	},
};

interface iAppProps {
	days: number;
	price: number;
	description: string;
	name: string;
	currency: string;
	features: string[];
}

export const propertyListingDurationPrice: iAppProps[] = [
	{
		days: 30,
		name: "Standard Listing",
		price: 1000,
		currency: "USD",
		description: "Visible in property search for 30 days",
		features: ["Listed in local search", "Expires after 30 days"],
	},
];

import {
	Droplets,
	Dumbbell,
	Car,
	Shield,
	Trees,
	Baby,
	Building2,
	Zap,
	Wind,
	Home,
	Wifi,
	Flame,
	PawPrint,
	Sofa,
	WashingMachine,
	Cpu,
	Utensils,
	Presentation,
	Accessibility,
} from "lucide-react";

export const amenities = [
	{ id: 1, name: "Swimming Pool", icon: Droplets },
	{ id: 2, name: "Gym / Fitness Center", icon: Dumbbell },
	{ id: 3, name: "Parking Space", icon: Car },
	{ id: 4, name: "24/7 Security", icon: Shield },
	{ id: 6, name: "Garden / Lawn", icon: Trees },
	{ id: 7, name: "Playground", icon: Baby },
	{ id: 8, name: "Clubhouse", icon: Building2 },
	{ id: 9, name: "Backup Generator", icon: Zap },
	{ id: 10, name: "Air Conditioning", icon: Wind },
	{ id: 11, name: "Balcony / Terrace", icon: Home },
	{ id: 12, name: "High-speed Internet", icon: Wifi },
	{ id: 13, name: "Fire Safety System", icon: Flame },
	{ id: 14, name: "Pet Friendly", icon: PawPrint },
	{ id: 15, name: "Furnished", icon: Sofa },
	{ id: 16, name: "Washer / Dryer", icon: WashingMachine },
	{ id: 17, name: "Smart Home Features", icon: Cpu },
	{ id: 18, name: "BBQ Area", icon: Utensils },
	{ id: 19, name: "Conference Room", icon: Presentation },
	{ id: 20, name: "Wheelchair Accessible", icon: Accessibility },
];

export default amenities;
