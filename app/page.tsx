"use client"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Home() {
  const { data: session } = authClient.useSession()
  const handleSignout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.message("Sign out successfully.")
        },
      },
    });
  }
  return (
    <div>
      <ModeToggle />
      <h1>Clario</h1>
      <pre>
        {
          JSON.stringify(session, null, 1)
        }
      </pre>
      {
        session && <>
          <Button variant={"destructive"} onClick={handleSignout}>Sign Out</Button>
        </>
      }
    </div>
  );
}
