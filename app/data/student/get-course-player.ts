import "server-only";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { notFound, redirect, RedirectType } from "next/navigation";

export interface PlayerLesson {
  id: string;
  title: string;
  description: string | null;
  videoFileKey: string | null;
  thumbnailFileKey: string | null;
  position: number;
  chapterId: string;
  isCompleted: boolean;
}

export interface PlayerChapter {
  id: string;
  title: string;
  position: number;
  lessons: {
    id: string;
    title: string;
    position: number;
    videoFileKey: string | null;
    isCompleted: boolean;
  }[];
}

export interface CoursePlayerData {
  course: {
    id: string;
    title: string;
    slug: string;
    fileKey: string;
  };
  currentLesson: PlayerLesson;
  prevLesson: { id: string; title: string } | null;
  nextLesson: { id: string; title: string } | null;
  chapters: PlayerChapter[];
  progress: {
    totalLessons: number;
    completedCount: number;
    progressPercentage: number;
  };
}

export const getCoursePlayerData = async (
  courseId: string,
  lessonId?: string,
): Promise<CoursePlayerData> => {
  const user = await requireUser();

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      slug: true,
      fileKey: true,
      chapters: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              videoFileKey: true,
              thumbnailFileKey: true,
              position: true,
              chapterId: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  // Verify enrollment status
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: courseId,
      },
    },
    select: {
      status: true,
    },
  });

  if (!enrollment || enrollment.status !== "ACTIVE") {
    return redirect(`/courses/${course.slug}`, RedirectType.replace);
  }

  // Flatten all lessons in order
  const allLessons = course.chapters.flatMap((chapter) => chapter.lessons);

  if (allLessons.length === 0) {
    return notFound();
  }

  // Fetch user's completion progress for all lessons in this course
  const allLessonIds = allLessons.map((l) => l.id);
  const progressRecords = await prisma.lessonProgress.findMany({
    where: {
      userId: user.id,
      lessonId: { in: allLessonIds },
      completed: true,
    },
    select: {
      lessonId: true,
    },
  });

  const completedLessonIdSet = new Set(
    progressRecords.map((record) => record.lessonId),
  );

  // Determine active lesson
  let targetLesson = lessonId
    ? allLessons.find((l) => l.id === lessonId)
    : undefined;

  if (!targetLesson) {
    // Default to the first uncompleted lesson, or the first lesson
    targetLesson =
      allLessons.find((l) => !completedLessonIdSet.has(l.id)) || allLessons[0];
  }

  const currentIndex = allLessons.findIndex((l) => l.id === targetLesson.id);

  const prevLesson =
    currentIndex > 0
      ? {
          id: allLessons[currentIndex - 1].id,
          title: allLessons[currentIndex - 1].title,
        }
      : null;

  const nextLesson =
    currentIndex < allLessons.length - 1
      ? {
          id: allLessons[currentIndex + 1].id,
          title: allLessons[currentIndex + 1].title,
        }
      : null;

  const completedCount = completedLessonIdSet.size;
  const progressPercentage = Math.round(
    (completedCount / allLessons.length) * 100,
  );

  const chapters: PlayerChapter[] = course.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    position: chapter.position,
    lessons: chapter.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      position: lesson.position,
      videoFileKey: lesson.videoFileKey,
      isCompleted: completedLessonIdSet.has(lesson.id),
    })),
  }));

  return {
    course: {
      id: course.id,
      title: course.title,
      slug: course.slug,
      fileKey: course.fileKey,
    },
    currentLesson: {
      ...targetLesson,
      isCompleted: completedLessonIdSet.has(targetLesson.id),
    },
    prevLesson,
    nextLesson,
    chapters,
    progress: {
      totalLessons: allLessons.length,
      completedCount,
      progressPercentage,
    },
  };
};
