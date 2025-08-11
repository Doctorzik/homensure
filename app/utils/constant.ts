// File: app/utils/constant.ts

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
		price: 4.99,
		currency: "USD",
		description: "Visible in property search for 30 days",
		features: ["Listed in local search", "Expires after 30 days"],
	},
];
