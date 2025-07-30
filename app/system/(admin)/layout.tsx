import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"



export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (session?.user.role !== "ADMIN") return redirect("/properties")
  return (
    <html lang="en">
      <body>

        <main>{children}</main>
      </body>
    </html>
  )
}