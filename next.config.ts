import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	

	images: {
		remotePatterns: [
			{
				hostname: "picsum.photos",
				port: "",
				protocol: "https",
			},
		],
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "4mb",
		},
	},
};


export default nextConfig;
