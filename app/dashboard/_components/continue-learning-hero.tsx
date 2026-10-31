import Image from "next/image";
import Link from "next/link";
import { EnrolledCourseItem } from "@/app/data/student/get-enrolled-courses";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayIcon, CheckmarkBadge01Icon } from "@hugeicons/core-free-icons";

interface ContinueLearningHeroProps {
  course: EnrolledCourseItem;
}

export function ContinueLearningHero({ course }: ContinueLearningHeroProps) {
  const thumbnailUrl = `https://clario.t3.storage.dev/${course.fileKey}`;
  const targetHref = course.nextLessonId
    ? `/learn/${course.id}/${course.nextLessonId}`
    : `/learn/${course.id}`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card/80 to-card/30 p-6 md:p-8 backdrop-blur-md">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] lg:grid-cols-[1fr_320px] gap-6 items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="uppercase text-xs font-semibold">
              Continue Learning
            </Badge>
            <Badge variant="outline" className="text-xs">
              {course.category}
            </Badge>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {course.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {course.shortDescription}
            </p>
          </div>

          <div className="space-y-2 max-w-md">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Course Progress</span>
              <span className="font-semibold text-foreground">
                {course.completedLessons} / {course.totalLessons} lessons ({course.progressPercentage}%)
              </span>
            </div>
            <Progress value={course.progressPercentage} className="h-2.5" />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Link
              href={targetHref}
              className={buttonVariants({
                size: "lg",
                className: "rounded-xl font-medium gap-2 shadow-sm",
              })}
            >
              {course.isCompleted ? (
                <>
                  <HugeiconsIcon icon={CheckmarkBadge01Icon} className="size-5" />
                  Review Course
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={PlayIcon} className="size-5 fill-current" />
                  Resume Learning
                </>
              )}
            </Link>
            <Link
              href={`/courses/${course.slug}`}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "rounded-xl",
              })}
            >
              Course Overview
            </Link>
          </div>
        </div>

        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-border/50">
          <Image
            src={thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-xs font-medium">
            {course.progressPercentage}% Complete
          </div>
        </div>
      </div>
    </div>
  );
}
