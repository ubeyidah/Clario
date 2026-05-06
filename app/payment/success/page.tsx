import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md rounded-2xl border-none bg-transparent shadow-none">
        <CardContent className="flex flex-col items-center gap-5 py-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/80">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-green-600">
            Payment Successful!
          </h1>

          <p className="text-sm text-muted-foreground">
            Your payment has been processed successfully.
            <br />
            Your course enrollment is being confirmed.
          </p>

          <Button asChild className="mt-2 gap-2">
            <Link href="/courses">
              <ArrowRight className="h-4 w-4" />
              Continue to Courses
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}