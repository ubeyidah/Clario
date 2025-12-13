import { ShieldAlert, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md rounded-2xl border-none bg-transparent shadow-none">
        <CardContent className="flex flex-col items-center gap-5 py-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/80">
            <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-red-600">
            Access Denied
          </h1>

          <p className="text-sm text-muted-foreground">
            You don’t have permission to view this page.
            <br />
            This area is restricted to administrators only.
          </p>

          <Button asChild className="mt-2 gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Go back home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
