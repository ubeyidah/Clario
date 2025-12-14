import "server-only"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect, RedirectType } from "next/navigation"

export const requireAdmin = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    return redirect("/sign-in", RedirectType.replace)
  }

  if (session.user.role === "admin") {
    return session;
  }

  return redirect("/not-admin", RedirectType.replace)
}
