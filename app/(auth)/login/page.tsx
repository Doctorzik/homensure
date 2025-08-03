import LoginForm from "@/components/molecules/LoginForm";
import { auth} from "@/lib/auth";
import { redirect } from "next/navigation";





export default async function Login() {

  const session = await auth()



  if (session) {
    if (session.user?.role === "ADMIN") {
      redirect("/system/dashboard");
    } else if (session.user?.role === "AGENT") {
      redirect("/user/agent/profile");
    } else {
      redirect("/properties");
    }
  }



  return (

    <>

      <LoginForm />
    </>
  );
}

