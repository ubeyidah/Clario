import { AdminCoursesType } from "@/app/data/admin/get-admin-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFileKeyToUrl } from "@/hooks/use-file-key-to-url";
import { badgeClasses, courseStatusToVariant } from "@/lib/badge";
import { cn, formatDuration, formatETB } from "@/lib/utils";
import { Edit, Eye, Users, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteCourseDialog } from "./delete-course-dialog";

interface iAppProps {
  isFirst?: boolean;
  course: AdminCoursesType;
}

const CourseCard = ({ course, isFirst }: iAppProps) => {
  const thumbnailUrl = useFileKeyToUrl(course.fileKey);
  const enrolledCount = course._count?.enrollment || 0;
  const chaptersCount = course._count?.chapters || 0;

  return (
    <div
      className={cn(
        "border-b group py-4 px-2 hover:bg-card/40 transition-colors duration-300 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4",
        isFirst && "border-t"
      )}
    >
      <div className="relative rounded-xl bg-linear-to-bl from-neutral-100/30 via-neutral-50/30 to-neutral-100/30 overflow-hidden aspect-video">
        <Link href={`/admin/courses/${course.id}`}>
          <Image
            src={thumbnailUrl}
            fill
            alt={course.title}
            className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-102"
            loading="lazy"
          />
        </Link>
        <p className="absolute bottom-2 px-2 py-0.5 rounded-md right-2 text-xs font-medium bg-background/80 backdrop-blur-3xl">
          {formatDuration(course.duration)}
        </p>
      </div>

      <div className="flex flex-col justify-between max-md:gap-3 relative">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <Link
              href={`/admin/courses/${course.id}`}
              className="text-lg font-bold hover:underline hover:text-primary transition-colors line-clamp-1"
            >
              {course.title}
            </Link>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {course.shortDescription}
            </p>
          </div>

          <div
            className={badgeClasses(
              courseStatusToVariant(course.status),
              "shrink-0"
            )}
          >
            {course.status}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <p className="uppercase font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              {formatETB(course.price)}
            </p>
            <Badge variant="secondary">{course.category}</Badge>
            <Badge variant="outline">{course.level}</Badge>

            <span className="flex items-center gap-1 text-muted-foreground ml-2">
              <Users className="size-3.5 text-blue-500" />
              <strong className="text-foreground">{enrolledCount}</strong>{" "}
              student{enrolledCount === 1 ? "" : "s"}
            </span>

            <span className="flex items-center gap-1 text-muted-foreground">
              <BookOpen className="size-3.5 text-purple-500" />
              <strong className="text-foreground">{chaptersCount}</strong>{" "}
              chapter{chaptersCount === 1 ? "" : "s"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "cursor-pointer rounded-lg h-8 px-2.5 text-xs",
                    })}
                  >
                    <Eye className="size-3.5 mr-1" />
                    Overview
                  </Link>
                </TooltipTrigger>
                <TooltipContent>View Course Performance & Syllabus</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/admin/courses/${course.id}/edit`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "cursor-pointer rounded-lg h-8 px-2.5 text-xs",
                    })}
                  >
                    <Edit className="size-3.5 mr-1" />
                    Edit
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Edit Course Curriculum & Metadata</TooltipContent>
              </Tooltip>

              <DeleteCourseDialog
                courseId={course.id}
                courseTitle={course.title}
              />
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
