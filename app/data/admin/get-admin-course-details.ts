import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export interface AdminCourseDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  fileKey: string;
  price: number;
  duration: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  status: "Draft" | "Published" | "Archived";
  stripePriceId: string;
  stripeProductId: string | null;
  createdAt: Date;
  updatedAt: Date;
  creator: {
    name: string;
    email: string;
  };
  chapters: Array<{
    id: string;
    title: string;
    position: number;
    lessons: Array<{
      id: string;
      title: string;
      description: string | null;
      videoFileKey: string | null;
      thumbnailFileKey: string | null;
      position: number;
    }>;
  }>;
  stats: {
    totalStudents: number;
    totalRevenue: number;
    totalLessons: number;
    totalChapters: number;
    completionRate: number;
  };
  enrolledStudents: Array<{
    enrollmentId: string;
    studentId: string;
    name: string;
    email: string;
    image: string | null;
    amount: number;
    status: "ACTIVE" | "PENDING" | "CANCELED";
    enrolledAt: Date;
    completedLessons: number;
    progressPercentage: number;
  }>;
}

export const getAdminCourseDetails = async (
  courseId: string
): Promise<AdminCourseDetail> => {
  await requireAdmin();

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      user: {
        select: { name: true, email: true },
      },
      chapters: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
          },
        },
      },
      enrollment: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Count total lessons
  const allLessonIds: string[] = [];
  for (const ch of course.chapters) {
    for (const l of ch.lessons) {
      allLessonIds.push(l.id);
    }
  }
  const totalLessons = allLessonIds.length;
  const totalChapters = course.chapters.length;

  const activeEnrollments = course.enrollment.filter(
    (e) => e.status === "ACTIVE"
  );
  const totalStudents = activeEnrollments.length;
  const totalRevenue = activeEnrollments.reduce((sum, e) => sum + e.amount, 0);

  // Fetch lesson progress for all enrolled users in this course
  const enrolledUserIds = course.enrollment.map((e) => e.userId);
  const progressRecords =
    enrolledUserIds.length > 0 && allLessonIds.length > 0
      ? await prisma.lessonProgress.findMany({
          where: {
            userId: { in: enrolledUserIds },
            lessonId: { in: allLessonIds },
            completed: true,
          },
          select: {
            userId: true,
            lessonId: true,
          },
        })
      : [];

  const userProgressMap = new Map<string, number>();
  for (const prog of progressRecords) {
    userProgressMap.set(
      prog.userId,
      (userProgressMap.get(prog.userId) || 0) + 1
    );
  }

  let totalCompletedLessonsByActiveStudents = 0;
  for (const active of activeEnrollments) {
    totalCompletedLessonsByActiveStudents +=
      userProgressMap.get(active.userId) || 0;
  }

  const maxPossibleLessons = totalStudents * totalLessons;
  const courseCompletionRate =
    maxPossibleLessons > 0
      ? Math.round(
          (totalCompletedLessonsByActiveStudents / maxPossibleLessons) * 100
        )
      : 0;

  const enrolledStudents = course.enrollment.map((e) => {
    const completed = userProgressMap.get(e.userId) || 0;
    const progressPercentage =
      totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

    return {
      enrollmentId: e.id,
      studentId: e.user.id,
      name: e.user.name,
      email: e.user.email,
      image: e.user.image,
      amount: e.amount,
      status: e.status as "ACTIVE" | "PENDING" | "CANCELED",
      enrolledAt: e.createdAt,
      completedLessons: completed,
      progressPercentage,
    };
  });

  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    shortDescription: course.shortDescription,
    fileKey: course.fileKey,
    price: course.price,
    duration: course.duration,
    level: course.level,
    category: course.category,
    status: course.status,
    stripePriceId: course.stripePriceId,
    stripeProductId: course.stripeProductId,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    creator: {
      name: course.user.name,
      email: course.user.email,
    },
    chapters: course.chapters,
    stats: {
      totalStudents,
      totalRevenue,
      totalLessons,
      totalChapters,
      completionRate: courseCompletionRate,
    },
    enrolledStudents,
  };
};
