import { auth } from "@/lib/auth";

import { redirect } from "next/navigation";




import { getUserAgent } from "@/lib/actions/user-actions";

import AgentProfileEdit from "@/components/molecules/AgentProfile";


export default async function AgentProfilePage() {
    // 1) Ensure signed in
    const session = await auth();
    if (!session) {
        redirect("/login");
    }


    const result = await getUserAgent(session.user.id)
    if (result.status === "error") {
        return <div>Error: {result.message}</div>;
    }

    if (result.status === "not_found") {
        return <div>User not found</div>;
    }
    if (result.status === "success")
           
        return (
            <AgentProfileEdit {...result.data} />

        )
  


}
