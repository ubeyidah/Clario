import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubIcon } from "lucide-react";

export default function SignIn() {

  return <Card>
    <CardHeader>
      <CardTitle>Welcome Back!</CardTitle>
      <CardDescription>Login with yout Github or Email address</CardDescription>
    </CardHeader>
    <CardContent>
      <Button className="w-full">
        <GithubIcon className="size-4" />
        Sign in with Github</Button>
    </CardContent>
  </Card>
}
