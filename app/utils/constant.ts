export const appUrls = {
	landingPage: "/",
	properties: "/properties",
	userprofile: "/userProfile",
	login: {
		landing: "/login",
		register: "/register",
	},
	agentprofile: "/agentprofile",
	system: {
		adminlanding: "/system/agentapplications",
		adminreviewpage: "system/applicationreview",
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
