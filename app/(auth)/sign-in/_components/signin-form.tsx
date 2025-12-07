"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { GithubIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";


const SignInForm = () => {

    const [githubPending, startGithubTransaction] = useTransition()
    async function signInWithGithub() {
        startGithubTransaction(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
                fetchOptions: {
                    onError: (error) => {
                        toast.error("Login with GitHub failed. Please try again or use another login method.")
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
                <Button variant="secondary" className="w-full" onClick={signInWithGithub}>
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
                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Email Address" />
                    </div>
                    <Button>Continue with Email</Button>
                </div>
            </CardContent>
        </Card>

    );
};

export default SignInForm;