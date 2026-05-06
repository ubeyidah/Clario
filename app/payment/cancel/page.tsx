import { XCircle, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md rounded-2xl border-none bg-transparent shadow-none">
        <CardContent className="flex flex-col items-center gap-5 py-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/80">
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-red-600">
            Payment Canceled
          </h1>

          <p className="text-sm text-muted-foreground">
            Your payment was canceled and no charges were made.
            <br />
            You can try enrolling again anytime.
          </p>

          <div className="flex gap-2 mt-2">
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button asChild>
              <Link href="/courses">
                <ArrowRight className="h-4 w-4 mr-2" />
                Browse Courses
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}