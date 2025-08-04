"use server";

import { userSchema } from "../schemas/userSchema";
import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma";
import { redirect } from "next/navigation";

import { auth, signOut } from "../auth";

const saltRounds = 10;
// function to create a user using credentials
export async function createUser(formData: FormData) {
	try {
		// Get the email and password from the form data

		const userEmail = formData.get("email");
		const userName = formData.get("name");
		const userPassword = formData.get("password");

		// Validate the password to make sure it same with the shema
		const validateCredentials = userSchema.safeParse({
			email: userEmail,
			password: userPassword,
			name: userName,
		});

		if (validateCredentials.success) {
			const { email, password, name } = validateCredentials.data;

			// Hash the password
			const harshedPassword = bcrypt.hashSync(password, saltRounds);

			// register the user
			const user = await prisma.user.create({
				data: {
					email: email,
					password: harshedPassword,
					name: name,
				},
			});
			if (!user) {
				throw new Error("No user found");
			}
			// route the user to login in page

			// redirect("/login");
		}
	} catch (error) {
		return error;
	}
}

export async function SignOut() {
	await signOut({ redirectTo: "/" });
	redirect("/");
}

export async function getUser(userEmail: string) {
	const session = await auth();
	if (!session) throw new Error("No user Found");

	const user = await prisma.user.findUnique({
		where: {
			email: userEmail,
		},
		select: {
			id: true,
			role: true,
		},
	});
	if (!user) {
		throw new Error("No user found for");
	} else {
		return user;
	}
}


