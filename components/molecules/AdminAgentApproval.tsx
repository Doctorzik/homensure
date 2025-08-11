
"use client"

import { approveAgent } from "@/lib/actions/admin-actions"
import { useRouter } from "next/navigation"


interface iAppProps {
  id: string 
}

export default function AgentDecision({ id }: iAppProps) {
  const { refresh } = useRouter()
  const handleSubmit = async () => {


    const result = await approveAgent(id)
    if (result?.success) {
      refresh()

      return
    }


  }
  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit}>
        <button type="submit" className="w-full bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs md:text-sm">Approve</button>
      </form>
      <form action="">
        <button type="submit" className="w-full bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs md:text-sm">Reject</button>
      </form>
    </div>
  )
}