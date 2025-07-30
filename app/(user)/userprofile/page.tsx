import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function UserProfilePage() {
  const session = await auth()

  if (!session) {
    redirect("/")
  }
  return (
    <div>
      {session.user?.email}
      {session.user?.name}

      User Profile Page
    </div>
  )
}