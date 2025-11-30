import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GithubIcon } from "lucide-react";

export default function SignIn() {

  return <Card>
    <CardHeader>
      <CardTitle>Welcome Back!</CardTitle>
      <CardDescription>Login with yout Github or Email address</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <Button className="w-full">
        <GithubIcon className="size-4" />
        Sign in with Github</Button>
      <div className="text-center relative text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:border-t after:border-border after:flex after:items-center">
        <span className="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</span>
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
