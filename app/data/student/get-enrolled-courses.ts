import "server-only";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { CourseLevel } from "@/lib/generated/prisma/enums";

export interface EnrolledCourseItem {
  id: string;
  title: string;
  slug: string;
  fileKey: string;
  duration: number;
  level: CourseLevel;
  category: string;
  shortDescription: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  isCompleted: boolean;
  nextLessonId: string | null;
  enrolledAt: Date;
}

export interface StudentDashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalHours: number;
}

export interface StudentDashboardData {
  courses: EnrolledCourseItem[];
  stats: StudentDashboardStats;
}

export const getEnrolledCourses = async (): Promise<StudentDashboardData> => {
  const user = await requireUser();

  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      createdAt: true,
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          fileKey: true,
          duration: true,
          level: true,
          category: true,
          shortDescription: true,
          chapters: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              title: true,
              position: true,
              lessons: {
                orderBy: {
                  position: "asc",
                },
                select: {
                  id: true,
                  title: true,
                  position: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (enrollments.length === 0) {
    return {
      courses: [],
      stats: {
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        totalHours: 0,
      },
    };
  }

  // Collect all lesson IDs across enrolled courses to fetch user progress in a single query
  const allLessonIds = enrollments.flatMap((enrollment) =>
    (enrollment.course?.chapters || []).flatMap((chapter) =>
      (chapter.lessons || []).map((lesson) => lesson.id),
    ),
  );

  const progressRecords =
    allLessonIds.length > 0
      ? await prisma.lessonProgress.findMany({
          where: {
            userId: user.id,
            lessonId: { in: allLessonIds },
            completed: true,
          },
          select: {
            lessonId: true,
          },
        })
      : [];

  const completedLessonIdSet = new Set(
    progressRecords.map((record) => record.lessonId),
  );

  let completedCoursesCount = 0;
  let inProgressCoursesCount = 0;
  let totalHours = 0;

  const courses: EnrolledCourseItem[] = enrollments
    .filter((enrollment) => !!enrollment.course)
    .map((enrollment) => {
      const course = enrollment.course;
      totalHours += course.duration || 0;

      const flattenedLessons = (course.chapters || []).flatMap(
        (chapter) => chapter.lessons || [],
      );
      const totalLessons = flattenedLessons.length;
      const completedCount = flattenedLessons.filter((lesson) =>
        completedLessonIdSet.has(lesson.id),
      ).length;

      const progressPercentage =
        totalLessons === 0
          ? 0
          : Math.round((completedCount / totalLessons) * 100);

      const isCompleted = totalLessons > 0 && completedCount === totalLessons;

      if (isCompleted) {
        completedCoursesCount += 1;
      } else if (totalLessons > 0) {
        inProgressCoursesCount += 1;
      }

      // Identify the next lesson to continue: first uncompleted lesson in order
      const nextUncompletedLesson = flattenedLessons.find(
        (lesson) => !completedLessonIdSet.has(lesson.id),
      );
      const nextLessonId =
        nextUncompletedLesson?.id ||
        (flattenedLessons.length > 0 ? flattenedLessons[0].id : null);

      return {
        id: course.id,
        title: course.title || "Untitled Course",
        slug: course.slug,
        fileKey: course.fileKey || "",
        duration: course.duration || 0,
        level: course.level,
        category: course.category || "General",
        shortDescription: course.shortDescription || "",
        totalLessons,
        completedLessons: completedCount,
        progressPercentage,
        isCompleted,
        nextLessonId,
        enrolledAt: enrollment.createdAt,
      };
    });

  return {
    courses,
    stats: {
      totalCourses: courses.length,
      completedCourses: completedCoursesCount,
      inProgressCourses: inProgressCoursesCount,
      totalHours: Math.round(totalHours * 10) / 10,
    },
  };
};
