import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

export function DashboardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card/20">
      <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
        <HugeiconsIcon icon={Book02Icon} className="size-8" />
      </div>

      <h3 className="text-xl font-bold text-foreground">
        No courses enrolled yet
      </h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        Explore our curated catalog of courses to start learning, acquiring new skills, and tracking your progress.
      </p>

      <div className="mt-6">
        <Link
          href="/courses"
          className={buttonVariants({
            size: "lg",
            className: "rounded-xl gap-2",
          })}
        >
          Browse Courses
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
        </Link>
      </div>
    </div>
  );
}
