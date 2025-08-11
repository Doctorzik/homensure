import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Edit from "./edit";
import { Gender } from '@prisma/client';
import Link from 'next/link'; // Import the Link component

export default async function AgentProfilePage() {
    // 1) Ensure signed in
    const session = await auth();
    if (!session?.user?.email) {
        redirect("/login");
    }

    // 2) Fetch user + agent
    let user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { agent: true },
    });
    if (!user) {
        redirect("/");
    }

    // 3) If they have no Agent record yet, create one with default values
    if (!user.agent) {
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                agent: {
                    create: {
                        fullName: user.name || '',
                        phone: '',
                        dateOfBirth: new Date(),
                        joinedAt: new Date(),
                        gender: Gender.MALE, // Default to MALE (since only MALE/FEMALE exist)
                        address: '',
                        locality: '',
                    }
                }
            },
            include: { agent: true },
        });
        if (!updatedUser.agent) {
            throw new Error("Failed to create agent profile");
        }
        user = updatedUser;
    }

    // 4) Ensure all agent fields exist with fallbacks
    const agent = {
        fullName: user.agent?.fullName || '',
        phone: user.agent?.phone || '',
        dateOfBirth: user.agent?.dateOfBirth || new Date(),
        joinedAt: user.agent?.joinedAt || new Date(),
        gender: user.agent?.gender || Gender.MALE,
        address: user.agent?.address || '',
        locality: user.agent?.locality || '',
        nationalId: user.agent?.nationalId || '',
        idType: user.agent?.idType || '',
        idUrl: user.agent?.idUrl || '',
    };

    // 5) Serialize dates with null checks
    const safeUser = {
        ...user,
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
        emailVerified: user.emailVerified?.toISOString() ?? null,
        agent: {
            ...agent,
            dateOfBirth: agent.dateOfBirth instanceof Date ? agent.dateOfBirth.toISOString() : agent.dateOfBirth,
            joinedAt: agent.joinedAt instanceof Date ? agent.joinedAt.toISOString() : agent.joinedAt,
        },
    };

    // 6) Render the client-side Edit component
    return (
        <div> {/* Wrap the content in a div */}
            <Edit
                user={safeUser}
            />
            {/* Add the "Apply to Become an Agent" button */}
            {!agent && (
                <Link href="/agent/apply">
                    <button>Apply to Become an Agent</button>
                </Link>
            )}
        </div>
    );
}
