import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { userSchema } from "@/lib/schemas/userSchema";


const saltRounds = 10;

export async function POST(req: Request) {
	try {
	
		const body = await req.json();
		const { email, password } = body;

		const validated = userSchema.safeParse({ email, password });

		if (!validated.success) {
			return NextResponse.json({ error: "Invalid input" }, { status: 400 });
		}

		const hashedPassword = bcrypt.hashSync(password, saltRounds);

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		return NextResponse.json({ message: "User created successfully", user });
		
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : String(error) },
			{ status: 500 },
			
		);
	}
}
