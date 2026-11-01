import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export interface AdminDashboardStats {
  totalRevenue: number;
  revenueGrowthPercentage: number;
  totalStudents: number;
  studentGrowthPercentage: number;
  activeEnrollments: number;
  enrollmentGrowthPercentage: number;
  completionRate: number;
  coursesSummary: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
}

export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  await requireAdmin();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Parallel database queries for performance
  const [
    activeEnrollmentsList,
    recentEnrollments,
    previousEnrollments,
    totalStudents,
    recentStudents,
    previousStudents,
    courses,
    totalLessonProgressCount,
  ] = await Promise.all([
    // All active enrollments
    prisma.enrollment.findMany({
      where: { status: "ACTIVE" },
      select: { amount: true, courseId: true, userId: true },
    }),

    // Enrollments in last 30 days
    prisma.enrollment.findMany({
      where: {
        status: "ACTIVE",
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { amount: true },
    }),

    // Enrollments in previous 30 days (60 to 30 days ago)
    prisma.enrollment.findMany({
      where: {
        status: "ACTIVE",
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
      select: { amount: true },
    }),

    // Total students (non-admins)
    prisma.user.count({
      where: {
        OR: [{ role: null }, { role: "student" }],
      },
    }),

    // Students registered in last 30 days
    prisma.user.count({
      where: {
        OR: [{ role: null }, { role: "student" }],
        createdAt: { gte: thirtyDaysAgo },
      },
    }),

    // Students registered 30-60 days ago
    prisma.user.count({
      where: {
        OR: [{ role: null }, { role: "student" }],
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
    }),

    // Courses summary
    prisma.course.findMany({
      select: {
        status: true,
        chapters: {
          select: {
            _count: {
              select: { lessons: true },
            },
          },
        },
      },
    }),

    // Total completed lessons count
    prisma.lessonProgress.count({
      where: { completed: true },
    }),
  ]);

  // Total and period revenues
  const totalRevenue = activeEnrollmentsList.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  const currentPeriodRevenue = recentEnrollments.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  const previousPeriodRevenue = previousEnrollments.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  const revenueGrowthPercentage =
    previousPeriodRevenue === 0
      ? currentPeriodRevenue > 0
        ? 100
        : 0
      : Math.round(
          ((currentPeriodRevenue - previousPeriodRevenue) /
            previousPeriodRevenue) *
            100
        );

  const studentGrowthPercentage =
    previousStudents === 0
      ? recentStudents > 0
        ? 100
        : 0
      : Math.round(
          ((recentStudents - previousStudents) / previousStudents) * 100
        );

  const activeEnrollments = activeEnrollmentsList.length;
  const recentEnrollmentCount = recentEnrollments.length;
  const previousEnrollmentCount = previousEnrollments.length;

  const enrollmentGrowthPercentage =
    previousEnrollmentCount === 0
      ? recentEnrollmentCount > 0
        ? 100
        : 0
      : Math.round(
          ((recentEnrollmentCount - previousEnrollmentCount) /
            previousEnrollmentCount) *
            100
        );

  // Calculate total required lessons for all active enrollments
  const coursesWithLessons = await prisma.course.findMany({
    where: {
      id: { in: Array.from(new Set(activeEnrollmentsList.map((e) => e.courseId))) },
    },
    select: {
      id: true,
      chapters: {
        select: {
          _count: {
            select: { lessons: true },
          },
        },
      },
    },
  });

  const courseLessonMap = new Map<string, number>();
  for (const c of coursesWithLessons) {
    const totalLessons = c.chapters.reduce((sum, ch) => sum + ch._count.lessons, 0);
    courseLessonMap.set(c.id, totalLessons);
  }

  let totalExpectedLessons = 0;
  for (const enrollment of activeEnrollmentsList) {
    totalExpectedLessons += courseLessonMap.get(enrollment.courseId) || 0;
  }

  const completionRate =
    totalExpectedLessons > 0
      ? Math.min(
          100,
          Math.round((totalLessonProgressCount / totalExpectedLessons) * 100)
        )
      : 0;

  // Courses breakdown
  const coursesSummary = {
    total: courses.length,
    published: courses.filter((c) => c.status === "Published").length,
    draft: courses.filter((c) => c.status === "Draft").length,
    archived: courses.filter((c) => c.status === "Archived").length,
  };

  return {
    totalRevenue,
    revenueGrowthPercentage,
    totalStudents: totalStudents || 0,
    studentGrowthPercentage,
    activeEnrollments,
    enrollmentGrowthPercentage,
    completionRate,
    coursesSummary,
  };
};
