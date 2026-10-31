"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toggleLessonProgressA } from "@/app/student/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Tick01Icon,
  CheckmarkBadge01Icon,
  Loading01Icon,
  Certificate01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";

interface LessonNavigationControlsProps {
  courseId: string;
  lessonId: string;
  isCompleted: boolean;
  prevLesson: { id: string; title: string } | null;
  nextLesson: { id: string; title: string } | null;
}

export function LessonNavigationControls({
  courseId,
  lessonId,
  isCompleted,
  prevLesson,
  nextLesson,
}: LessonNavigationControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggleAndNext = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        toggleLessonProgressA(lessonId, !isCompleted)
      );

      if (error) {
        toast.error("Failed to update lesson status");
        return;
      }

      if (result?.success) {
        toast.success(result.message);

        // Auto-navigate to next lesson if completing and next exists
        if (!isCompleted && nextLesson) {
          router.push(`/learn/${courseId}/${nextLesson.id}`);
        } else if (!isCompleted && !nextLesson) {
          // Finished the course!
          router.push(`/learn/${courseId}/certificate`);
        }
      } else {
        toast.error(result?.message || "Error updating progress");
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-border/80">
      {/* Previous Lesson Button */}
      {prevLesson ? (
        <Link
          href={`/learn/${courseId}/${prevLesson.id}`}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "rounded-xl gap-2",
          })}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          <span className="hidden sm:inline">Previous:</span>
          <span className="max-w-[150px] truncate">{prevLesson.title}</span>
        </Link>
      ) : (
        <div />
      )}

      {/* Complete & Next Action */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleToggleAndNext}
          disabled={isPending}
          variant={isCompleted ? "outline" : "default"}
          className="rounded-xl gap-2"
        >
          {isPending ? (
            <HugeiconsIcon icon={Loading01Icon} className="size-4 animate-spin" />
          ) : isCompleted ? (
            <HugeiconsIcon icon={CheckmarkBadge01Icon} className="size-4 text-emerald-500" />
          ) : (
            <HugeiconsIcon icon={Tick01Icon} className="size-4" />
          )}
          {isCompleted ? "Completed" : "Mark as Complete"}
        </Button>

        {nextLesson ? (
          <Link
            href={`/learn/${courseId}/${nextLesson.id}`}
            className={buttonVariants({
              size: "sm",
              className: "rounded-xl gap-2",
            })}
          >
            <span className="hidden sm:inline">Next:</span>
            <span className="max-w-[150px] truncate">{nextLesson.title}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </Link>
        ) : (
          <Link
            href={`/learn/${courseId}/certificate`}
            className={buttonVariants({
              size: "sm",
              className: "rounded-xl gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white",
            })}
          >
            <HugeiconsIcon icon={Certificate01Icon} className="size-4" />
            <span>Certificate</span>
          </Link>
        )}
      </div>
    </div>
  );
}
