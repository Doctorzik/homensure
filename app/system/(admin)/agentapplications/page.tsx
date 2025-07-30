import { getAllApplications } from "@/lib/actions/admin-actions"



export default async function AgentApllications() {
  


 await getAllApplications()

  return (
    <div>Agent Applications</div>
  )
}