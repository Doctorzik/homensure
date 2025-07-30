import { getAllApplications } from "@/lib/actions/admin-actions"

export default async function AdminDashBoard() {

   await getAllApplications()
     
  return (
    <div>
      Admin Dashboard
    </div>
  )
}