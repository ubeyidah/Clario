"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Confetti from "react-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Certificate01Icon,
  CheckmarkBadge01Icon,
  DashboardSquare01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

interface CourseCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  totalLessons: number;
}

export function CourseCompletionModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  totalLessons,
}: CourseCompletionModalProps) {
  const [windowDimensions, setWindowDimensions] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isOpen && windowDimensions.width > 0 && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={350}
            gravity={0.15}
          />
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md p-6 text-center sm:p-8 space-y-4 rounded-3xl">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/5">
            <HugeiconsIcon icon={CheckmarkBadge01Icon} className="size-8" />
          </div>

          <DialogHeader className="space-y-2 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mx-auto">
              <HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
              Course Completed!
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
              Outstanding Achievement!
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              You have successfully completed all {totalLessons} lessons in{" "}
              <span className="font-semibold text-foreground">
                {courseTitle}
              </span>
              . Your dedication has paid off!
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-left space-y-1">
            <p className="text-xs font-semibold text-foreground">
              Official Certificate of Completion
            </p>
            <p className="text-xs text-muted-foreground">
              Your verified certificate is ready to view, share, or download as a PDF.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href={`/learn/${courseId}/certificate`}
              className={buttonVariants({
                size: "lg",
                className: "w-full rounded-xl gap-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md",
              })}
            >
              <HugeiconsIcon icon={Certificate01Icon} className="size-5" />
              View & Download Certificate
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-xl text-xs"
              >
                Review Lessons
              </Button>
              <Link
                href="/dashboard"
                className={buttonVariants({
                  variant: "secondary",
                  className: "rounded-xl text-xs gap-1.5",
                })}
              >
                <HugeiconsIcon icon={DashboardSquare01Icon} className="size-3.5" />
                Dashboard
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
