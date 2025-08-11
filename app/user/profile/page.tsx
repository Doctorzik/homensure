
import UserProfile from "@/components/molecules/UserProfile";
import { getUser } from "@/lib/actions/user-actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";




export default async function UserProfilePage() {
    const session = await auth()
    if (session?.user.role !== "USER") return redirect("/unauthorised")

    const result = await getUser()

    if (result.status === "error") {
        return <div>Error: {result.message}</div>;
    }

    if (result.status === "not_found") {
        return <div>User not found</div>;
    }

    if (result.status === "success") {
        const user = result.data;
        return (
            <UserProfile  {...user} />
        );
    }

    // Fallback (shouldn't reach here)
    return <div>Loading...</div>;
}


