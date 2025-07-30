import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { prisma } from "./db/prisma";

import { userSchema } from "./schemas/userSchema";
import bcrypt from "bcryptjs";
import { encode } from "next-auth/jwt";
import { uuid } from "zod";
// Removed incorrect adapter import

// types/next-auth.d.ts or in global.d.ts

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			email: string;
			name: string;
			image: string;
			role?: string;
		};
	}

	interface JWT {
		id?: string;
		email?: string;
		name?: string;
		picture?: string;
		role?: string;
	}
}

const prismaAdapterInstance = PrismaAdapter(prisma);

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: prismaAdapterInstance,
	providers: [
		GitHub({
			clientId: process.env.AUTH_GITHUB_ID!,
			clientSecret: process.env.AUTH_GITHUB_SECRET!,
		}),
		Credentials({
			credentials: {
				email: {},
				password: {},
			},
			authorize: async (credentials) => {
				const { success, data } = userSchema.safeParse(credentials);

				if (success) {
					const { email, password } = data;
					const user = await prisma.user.findUnique({
						where: {
							email: email,
						},
					});
					if (!user || user.password === null) {
						throw new Error("User not found");
					}
					const passWordMatched = await bcrypt.compare(password, user.password);

					if (!passWordMatched) {
						throw new Error("Invalid credential");
					}
					return user;
				}

				return null;
			},
		}),
	],

	session: {
		strategy: "jwt",
		maxAge: 10 * 60 * 60,
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				// On first login
				const dbUser = await prisma.user.findUnique({
					where: { email: user.email! },
				});

				token.email = user.email;
				token.name = user.name;
				token.picture = user.image;
				token.role = dbUser?.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.name = token.name as string;
				session.user.image = token.picture as string;
				session.user.email = token.email as string;
				session.user.role = token.role as string;
			}

			return session;
		},
	},
	// callbacks: {
	// 	async session({ session, token }) {
	// 		// Add custom user info from token to session

	// 		return session;
	// 	},

	// async signIn({ user, account, profile, email, credentials }) {
	// 	// Check if account is OAuth and not linked yet

	// 	if (account?.provider === "github") {
	// 		const existingUser = await prisma.user.findUnique({
	// 			where: { email: user.email },
	// 			include: { accounts: true },
	// 		});

	// 		if (!existingUser) {
	// 			throw new Error("No existing user");
	// 		} else {
	// 			// if the account is not already linked

	// 			const alreadLinked = existingUser.accounts.some(
	// 				(a) => (a.provider = "github")
	// 			);
	// 			if (!alreadLinked && existingUser) {
	// 				await prisma.account.create({
	// 					data: {
	// 						userId: existingUser.id,
	// 						provider: account.provider,
	// 						type: account.type,
	// 						providerAccountId: account.providerAccountId,
	// 						access_token: account.access_token,
	// 					},
	// 				});
	// 				return true;
	// 			}
	// 		}
	// 	}
	// 	return true;
	// },
	// },
	jwt: {
		encode: async function (params) {
			if (params.token?.credentials) {
				const sessionToken = uuid().toString();

				if (!params.token?.sub) {
					throw new Error("NO user id found in the session");
				}

				const createdSession = await prismaAdapterInstance.createSession?.({
					sessionToken: sessionToken,
					userId: params.token.sub!,
					expires: new Date(Date.now() + 30 * 60 * 60 * 1000),
				});

				if (!createdSession) {
					throw new Error("Failed to create session");
				}

				return sessionToken;
			}
			// Fallback to default encode if no credentials
			return encode(params);
		},
	},
	secret: process.env.AUTH_SECRET!,
});
