"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { GithubIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";


const SignInForm = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [githubPending, startGithubTransaction] = useTransition()
  const [emailPending, startEmailTransaction] = useTransition()

  async function signInWithGithub() {
    startGithubTransaction(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onError: () => {
            toast.error("Login with GitHub failed. Please try again or use another login method.")
          }
        }
      })
    })
  }
  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault()
    startEmailTransaction(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onError: () => {
            toast.error("Failed to send email. Please check the address and try again.")
          },
          onSuccess: () => {
            toast.success("Your email has been sent. Please check your inbox.")
            router.push(`/verify-request?email=${email}`)
          }
        }
      })
    })
  }
  return (
    <Card className="bg-transparent border-none">
      <CardHeader className="text-center">
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>Login with yout Github or Email address</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button disabled={emailPending || githubPending} variant="secondary" className="w-full" onClick={signInWithGithub}>
          {
            githubPending ?
              <Spinner /> :
              <>
                <GithubIcon className="size-4" />
                Sign in with Github
              </>
          }
        </Button>
        <div className="text-center relative text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:border-t after:border-border after:flex after:items-center">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">Or</span>
        </div>
        <form onSubmit={handleEmailLogin} className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email Address" />
          </div>
          <Button disabled={emailPending || githubPending} >
            {
              emailPending ?
                <Spinner /> :
                <>
                  Continue with Email
                </>
            }
          </Button>
        </form>
      </CardContent>
    </Card>

  );
};

export default SignInForm;
