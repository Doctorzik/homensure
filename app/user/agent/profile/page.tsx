import { auth } from "@/lib/auth";

import { redirect } from "next/navigation";




import { getUserAgent } from "@/lib/actions/user-actions";

import AgentProfileEdit from "@/components/molecules/AgentProfile";


export default async function AgentProfilePage() {
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
            <AgentProfileEdit status={"PENDING"} userId={""} phone={""} dateOfBirth={result.data.dateOfBirth} gender={result.data.gender} address={result.data.address} firstName={result.data.user.name ?? ""} lastName={result.data.user.name ?? ""} nationalIdNumber={result.data.nationalId ?? ""} videoUrl={result.data.idUrl ?? ""} desiredLocality={""} experience={null} motivation={result.data.idType ?? ""} pastRoles={null} interviewDate={null} reviewerNote={null} proofOfIdentityType={null} appliedAt={result.data.joinedAt} fullName={result.data.fullName} locality={""} nationalId={result.data.nationalId} idType={null} idUrl={null} joinedAt={result.data.user.updatedAt} country={result.data.country} {...result.data.user}   />

        )
  


}
