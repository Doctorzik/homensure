"use client"
import Image from "next/image";
import { appUrls } from "@/app/utils/constant";
import Link from "next/link";
import { HomeIcon, HousePlugIcon, InfoIcon, LogInIcon, LogOutIcon, User2 } from "lucide-react";

import { Button } from "../ui/button";

import { useSession, signOut } from "next-auth/react";

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
    icon: <InfoIcon />
  }
]



export function NavBar() {


  const { data: session } = useSession()
  return (

    <nav className="w-full  flex flex-col md:flex-row  justify-between  border-2">
      <Link href={"/"} className="w-[50px] self-start">
        <Image src="https://picsum.photos/200" alt="RentLynk Logo" width={50} height={50} />
      </Link>
      <ul className=" flex flex-row  justify-between gap-4">
        {navlinks.map((link, index) => (
          <Link className="mx-10 hover:bg-accent flex flex-row justify-center items-center" key={index} href={link.href}>
            {link.icon}
            <span>{link.name}</span>

          </Link>
        ))}
      </ul>

      <div>

        {session ? (
          <div className="flex justify-center items-center gap-4">
            <Link href={"/userprofile"} className="flex flex-col md:flex-row justify-center items-center p-2 m-0" >
              <User2 />
              <span>Goto Profile</span>
            </Link>
            <Button variant={"link"} type="button" onClick={() => signOut({ callbackUrl: "/" })} >
              <LogOutIcon />
              <span>Login Out</span>
            </Button>

          </div>

        ) :

          (
            <>
              <Link href={"/login"} className="flex flex-col md:flex-row justify-center items-center p-2 m-0" >
                <LogInIcon />
                <span>Login</span>
              </Link>
            </>
          )
        }





      </div>
    </nav>
  )
}

