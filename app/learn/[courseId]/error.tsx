"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  RefreshIcon,
  DashboardSquare01Icon,
  PlayIcon,
} from "@hugeicons/core-free-icons";

export default function CoursePlayerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const courseId = params?.courseId as string | undefined;

  useEffect(() => {
    console.error("Classroom error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6 p-8 rounded-3xl bg-card/60 border border-border backdrop-blur-md shadow-xl">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <HugeiconsIcon icon={AlertCircleIcon} className="size-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Classroom Playback Issue
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We encountered an unexpected error while preparing this lesson or streaming curriculum content.
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
            Reload Lesson
          </Button>

          {courseId && (
            <Link
              href={`/learn/${courseId}`}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "w-full sm:w-auto rounded-xl gap-1.5 text-xs",
              })}
            >
              <HugeiconsIcon icon={PlayIcon} className="size-3.5 fill-current" />
              Course Start
            </Link>
          )}

          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "w-full sm:w-auto rounded-xl gap-1.5 text-xs",
            })}
          >
            <HugeiconsIcon icon={DashboardSquare01Icon} className="size-3.5" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
