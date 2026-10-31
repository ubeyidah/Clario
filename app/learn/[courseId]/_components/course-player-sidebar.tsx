"use client";

import { useTransition } from "react";
import Link from "next/link";
import { PlayerChapter } from "@/app/data/student/get-course-player";
import { toggleLessonProgressA } from "@/app/student/actions";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpDownIcon,
  PlayIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";

interface CoursePlayerSidebarProps {
  courseId: string;
  courseTitle: string;
  currentLessonId: string;
  chapters: PlayerChapter[];
  progress: {
    totalLessons: number;
    completedCount: number;
    progressPercentage: number;
  };
}

export function CoursePlayerSidebar({
  courseId,
  courseTitle,
  currentLessonId,
  chapters,
  progress,
}: CoursePlayerSidebarProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleProgress = (lessonId: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        toggleLessonProgressA(lessonId, !currentStatus)
      );

      if (error) {
        toast.error("Failed to update lesson status");
        return;
      }

      if (result?.success) {
        toast.success(result.message);
      } else {
        toast.error(result?.message || "Error updating progress");
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-card/60 border-l border-border backdrop-blur-md">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border/80 space-y-3">
        <div>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Course Curriculum
          </span>
          <h2 className="text-base font-bold text-foreground line-clamp-1 mt-0.5">
            {courseTitle}
          </h2>
        </div>

        {/* Course Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{progress.progressPercentage}% completed</span>
            <span>
              {progress.completedCount}/{progress.totalLessons} lessons
            </span>
          </div>
          <Progress value={progress.progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Chapters & Lessons Accordion List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {chapters.map((chapter, chapterIndex) => {
          const hasCurrentLesson = chapter.lessons.some(
            (l) => l.id === currentLessonId
          );
          const chapterCompletedCount = chapter.lessons.filter(
            (l) => l.isCompleted
          ).length;

          return (
            <Collapsible
              key={chapter.id}
              defaultOpen={hasCurrentLesson || chapterIndex === 0}
              className="border border-border/60 rounded-xl overflow-hidden bg-card/40"
            >
              <CollapsibleTrigger className="w-full p-3 flex items-center justify-between text-left hover:bg-accent/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="size-6 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center font-semibold">
                    {chapterIndex + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold capitalize text-foreground">
                      {chapter.title}
                    </h3>
                    <span className="text-[11px] text-muted-foreground">
                      {chapterCompletedCount}/{chapter.lessons.length} completed
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <HugeiconsIcon icon={ArrowUpDownIcon} className="size-3.5 text-muted-foreground" />
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <Separator className="bg-border/40" />
                <div className="p-1 space-y-1">
                  {chapter.lessons.map((lesson, lessonIndex) => {
                    const isCurrent = lesson.id === currentLessonId;

                    return (
                      <Link
                        key={lesson.id}
                        href={`/learn/${courseId}/${lesson.id}`}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors group ${
                          isCurrent
                            ? "bg-primary text-primary-foreground font-medium shadow-xs"
                            : "hover:bg-accent/50 text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          {/* Play / Status Indicator */}
                          <div
                            className={`size-6 rounded-full flex items-center justify-center shrink-0 ${
                              isCurrent
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : lesson.isCompleted
                                ? "bg-emerald-500/20 text-emerald-500"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {lesson.isCompleted ? (
                              <HugeiconsIcon icon={Tick01Icon} className="size-3.5" />
                            ) : (
                              <HugeiconsIcon icon={PlayIcon} className="size-3 fill-current" />
                            )}
                          </div>

                          <span className="truncate">
                            {lessonIndex + 1}. {lesson.title}
                          </span>
                        </div>

                        {/* Interactive Completion Checkbox */}
                        <button
                          onClick={(e) => handleToggleProgress(lesson.id, lesson.isCompleted, e)}
                          disabled={isPending}
                          title={lesson.isCompleted ? "Mark incomplete" : "Mark completed"}
                          className={`size-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                            isCurrent
                              ? "border-primary-foreground/40 hover:bg-primary-foreground/20 text-primary-foreground"
                              : lesson.isCompleted
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-border hover:border-primary text-transparent"
                          }`}
                        >
                          <HugeiconsIcon icon={Tick01Icon} className="size-3" />
                        </button>
                      </Link>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
