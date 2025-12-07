import { auth } from "@/lib/auth";
import SignInForm from "./_components/signin-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (session) redirect("/")
  return <SignInForm />
}
