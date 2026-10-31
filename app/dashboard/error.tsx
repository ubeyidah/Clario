"use client";

import { useEffect } from "react";
import Wrapper from "@/components/common/wrapper";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, RefreshIcon, Home01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Student Dashboard runtime error:", error);
  }, [error]);

  return (
    <Wrapper as="main" className="py-16 flex flex-col items-center justify-center text-center space-y-6">
      <div className="p-4 rounded-full bg-destructive/10 text-destructive">
        <HugeiconsIcon icon={AlertCircleIcon} className="size-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Unable to Load Your Learning Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          We encountered an unexpected error while loading your enrolled courses and progress. Please try refreshing or return to the home page.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/70 font-mono">
            Error digest: {error.digest}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={() => reset()} className="gap-2 rounded-xl">
          <HugeiconsIcon icon={RefreshIcon} className="size-4" />
          Try Again
        </Button>
        <Button variant="outline" asChild className="gap-2 rounded-xl">
          <Link href="/">
            <HugeiconsIcon icon={Home01Icon} className="size-4" />
            Home
          </Link>
        </Button>
      </div>
    </Wrapper>
  );
}
