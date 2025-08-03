// File: app/components/molecules/NavBar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
    HomeIcon,
    HousePlugIcon,
    InfoIcon,
    LogInIcon,
    LogOutIcon,
    User2,
    Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { appUrls } from "@/app/utils/constant";

const navlinks = [
    {
        name: "RentLynk",
        href: appUrls.landingPage,
        icon: <HomeIcon />,
    },
    {
        name: "Properties",
        href: appUrls.properties,
        icon: <HousePlugIcon />,
    },
    {
        name: "About Us",
        href: "/#about",
        icon: <InfoIcon />,
    },
];

export function NavBar() {
    const { data: session } = useSession();

    // Default to login link
    let profileHref  = appUrls.login.landing;
    let profileLabel = "Login";
    let profileIcon  = <LogInIcon />;
    let showDashboard = false;
    let dashboardHref = "/system/dashboard";
    if (session?.user) {
        switch (session.user.role) {
            case "USER":
                profileHref  = appUrls.userProfile;
                profileLabel = "My Profile";
                profileIcon  = <User2 />;
                break;
            case "AGENT":
                profileHref  = appUrls.agentProfile;
                profileLabel = "Agent Profile";
                profileIcon  = <User2 />;
                break;
            case "ADMIN":
                profileHref  = "/user/profile";
                profileLabel = "Profile";
                profileIcon  = <User2 />;
                showDashboard = true;
                dashboardHref = "/system/dashboard";
                break;
        }
    }

    return (
        <nav className="w-full flex flex-col md:flex-row justify-between border-2 p-4">
            <Link href={appUrls.landingPage} className="flex items-center">
                <Image
                    src="https://picsum.photos/200"
                    alt="RentLynk Logo"
                    width={50}
                    height={50}
                />
            </Link>

            <ul className="flex gap-8">
                {navlinks.map((link, idx) => (
                    <li key={idx}>
                        <Link
                            href={link.href}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded"
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div>
                {session?.user ? (
                    <div className="flex items-center gap-4">
                        {showDashboard && (
                            <Link
                                href={dashboardHref}
                                className="flex items-center gap-2 px-3 py-2 rounded bg-primary text-white shadow-xs hover:bg-primary/90 transition-colors"
                            >
                                <SettingsIcon />
                                <span>Dashboard</span>
                            </Link>
                        )}
                        <Link
                            href={profileHref}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded"
                        >
                            {profileIcon}
                            <span>{profileLabel}</span>
                        </Link>
                        <Button
                            variant="link"
                            onClick={() => signOut({ callbackUrl: appUrls.landingPage })}
                        >
                            <LogOutIcon />
                            <span>Sign Out</span>
                        </Button>
                    </div>
                ) : (
                    <Link
                        href={appUrls.login.landing}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded"
                    >
                        <LogInIcon />
                        <span>Login</span>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
