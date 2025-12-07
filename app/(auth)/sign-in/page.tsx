"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { GithubIcon } from "lucide-react";
import { toast } from "sonner";

export default function SignIn() {
  async function signInWithGithub() {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
      fetchOptions: {
        onSuccess: () => {
          toast.success("Successfully signed in with Github!")
        },
        onError: (error) => {
          toast.error(error.error.message)
        }

      }
    })
  }

  return <Card className="bg-transparent border-none">
    <CardHeader className="text-center">
      <CardTitle>Welcome Back!</CardTitle>
      <CardDescription>Login with yout Github or Email address</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <Button variant="secondary" className="w-full" onClick={signInWithGithub}>
        <GithubIcon className="size-4" />
        Sign in with Github</Button>

      <Button variant="secondary" className="w-full" >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M564 325.8C564 467.3 467.1 568 324 568C186.8 568 76 457.2 76 320C76 182.8 186.8 72 324 72C390.8 72 447 96.5 490.3 136.9L422.8 201.8C334.5 116.6 170.3 180.6 170.3 320C170.3 406.5 239.4 476.6 324 476.6C422.2 476.6 459 406.2 464.8 369.7L324 369.7L324 284.4L560.1 284.4C562.4 297.1 564 309.3 564 325.8z" /></svg>
        Sign in with Google</Button>
      <div className="text-center relative text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:border-t after:border-border after:flex after:items-center">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">Or</span>
      </div>
      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Email Address" />
        </div>
        <Button>Continue with Email</Button>
      </div>
    </CardContent>
  </Card>
}
