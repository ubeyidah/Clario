"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  RefreshIcon,
  DashboardSquare01Icon,
} from "@hugeicons/core-free-icons";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin area error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-8 text-center min-h-[60vh]">
      <div className="max-w-md w-full space-y-6 p-8 rounded-3xl bg-card/60 border border-border backdrop-blur-md shadow-xl">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <HugeiconsIcon icon={AlertCircleIcon} className="size-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Admin Panel Error
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            An error occurred while rendering the administration interface or querying administrative records.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-muted-foreground/70">
              Error code: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <Button
            onClick={() => reset()}
            size="sm"
            className="w-full sm:w-auto rounded-xl gap-1.5 text-xs font-semibold"
          >
            <HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
            Retry Action
          </Button>

          <Link
            href="/admin"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "w-full sm:w-auto rounded-xl gap-1.5 text-xs",
            })}
          >
            <HugeiconsIcon icon={DashboardSquare01Icon} className="size-3.5" />
            Admin Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
