"use client";

import { useTransition } from "react";
import { enrollInCourseA } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface EnrollmentButtonProps {
  courseId: string;
  isEnrolled: boolean;
}

const EnrollmentButton = ({ courseId, isEnrolled }: EnrollmentButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleEnroll = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(enrollInCourseA(courseId));
      console.log({ result, error });
      if (error) {
        if (error instanceof Error && error.message?.includes("NEXT_REDIRECT")) {
          return;
        }
        toast.error("An unexpected error occurred.");
        return;
      }

      if (result) {
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      }
    });
  };

  if (isEnrolled) {
    return (
      <Link
        href="/dashboard"
        className={buttonVariants({ className: "w-full" })}
      >
        Watch now
      </Link>
    );
  }

  return (
    <Button className="w-full" onClick={handleEnroll} disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Enroll Now"
      )}
    </Button>
  );
};

export default EnrollmentButton;
