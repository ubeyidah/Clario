import Image from "next/image";
import Link from "next/link";
import { EnrolledCourseItem } from "@/app/data/student/get-enrolled-courses";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDuration } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayIcon, CheckmarkBadge01Icon } from "@hugeicons/core-free-icons";

interface EnrolledCourseCardProps {
  course: EnrolledCourseItem;
}

export function EnrolledCourseCard({ course }: EnrolledCourseCardProps) {
  const thumbnailUrl = `https://clario.t3.storage.dev/${course.fileKey}`;
  const targetHref = course.nextLessonId
    ? `/learn/${course.id}/${course.nextLessonId}`
    : `/learn/${course.id}`;

  return (
    <Card className="overflow-hidden bg-card/40 border-border/60 hover:border-border transition-all flex flex-col justify-between group">
      <div>
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <Badge
            variant="secondary"
            className="absolute top-2.5 right-2.5 uppercase text-[10px] font-semibold bg-black/70 text-white border-none"
          >
            {course.level}
          </Badge>
          <div className="absolute bottom-2 left-2.5 text-xs text-white/90 font-medium">
            {formatDuration(course.duration)}
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              {course.category}
            </span>
            {course.isCompleted && (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
                Completed
              </Badge>
            )}
          </div>

          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {course.shortDescription}
          </p>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{course.progressPercentage}% completed</span>
              <span>
                {course.completedLessons}/{course.totalLessons} lessons
              </span>
            </div>
            <Progress value={course.progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </div>

      <div className="p-4 pt-0">
        <Link
          href={targetHref}
          className={buttonVariants({
            variant: course.isCompleted ? "outline" : "default",
            size: "sm",
            className: "w-full rounded-xl gap-2",
          })}
        >
          {course.isCompleted ? (
            <>
              <HugeiconsIcon icon={CheckmarkBadge01Icon} className="size-4" />
              Watch Again
            </>
          ) : (
            <>
              <HugeiconsIcon icon={PlayIcon} className="size-4 fill-current" />
              Continue Lesson
            </>
          )}
        </Link>
      </div>
    </Card>
  );
}
