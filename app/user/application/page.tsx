
import { AgentApplicationForm } from "@/components/molecules/AgentApplicationForm"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AgentApplication() {

  const session = await auth()

  if (!session?.user) {
    return redirect("/login")
  }

  return (

    <div>



      <AgentApplicationForm />

    </div>
  )
}