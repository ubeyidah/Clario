import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export interface AnalyticsTrendPoint {
  date: string;
  revenue: number;
  enrollments: number;
}

export interface CategoryDistribution {
  category: string;
  coursesCount: number;
  enrollmentsCount: number;
  revenue: number;
}

export interface TopCourse {
  id: string;
  title: string;
  slug: string;
  fileKey: string;
  category: string;
  price: number;
  status: string;
  enrollmentsCount: number;
  revenue: number;
}

export const getAdminRevenueAndEnrollmentTrends = async (
  days = 30
): Promise<AnalyticsTrendPoint[]> => {
  await requireAdmin();

  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  // Fetch all enrollments in the date range
  const enrollments = await prisma.enrollment.findMany({
    where: {
      status: "ACTIVE",
      createdAt: { gte: startDate },
    },
    select: {
      amount: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Group by day YYYY-MM-DD
  const daysMap = new Map<string, { revenue: number; enrollments: number }>();

  for (let i = 0; i <= days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split("T")[0];
    daysMap.set(key, { revenue: 0, enrollments: 0 });
  }

  for (const item of enrollments) {
    const key = item.createdAt.toISOString().split("T")[0];
    const existing = daysMap.get(key) || { revenue: 0, enrollments: 0 };
    daysMap.set(key, {
      revenue: Math.round((existing.revenue + item.amount) * 100) / 100,
      enrollments: existing.enrollments + 1,
    });
  }

  return Array.from(daysMap.entries()).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    enrollments: data.enrollments,
  }));
};

export const getAdminCategoryDistribution = async (): Promise<
  CategoryDistribution[]
> => {
  await requireAdmin();

  const courses = await prisma.course.findMany({
    select: {
      id: true,
      category: true,
      enrollment: {
        where: { status: "ACTIVE" },
        select: { amount: true },
      },
    },
  });

  const categoryMap = new Map<
    string,
    { coursesCount: number; enrollmentsCount: number; revenue: number }
  >();

  for (const course of courses) {
    const cat = course.category || "Uncategorized";
    const existing = categoryMap.get(cat) || {
      coursesCount: 0,
      enrollmentsCount: 0,
      revenue: 0,
    };

    const courseEnrollments = course.enrollment.length;
    const courseRev = course.enrollment.reduce((acc, curr) => acc + curr.amount, 0);

    categoryMap.set(cat, {
      coursesCount: existing.coursesCount + 1,
      enrollmentsCount: existing.enrollmentsCount + courseEnrollments,
      revenue: existing.revenue + courseRev,
    });
  }

  return Array.from(categoryMap.entries())
    .map(([category, val]) => ({
      category,
      coursesCount: val.coursesCount,
      enrollmentsCount: val.enrollmentsCount,
      revenue: val.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue);
};

export const getTopPerformingCourses = async (
  limit = 5
): Promise<TopCourse[]> => {
  await requireAdmin();

  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      fileKey: true,
      category: true,
      price: true,
      status: true,
      enrollment: {
        where: { status: "ACTIVE" },
        select: { amount: true },
      },
    },
  });

  const formatted: TopCourse[] = courses.map((course) => ({
    id: course.id,
    title: course.title,
    slug: course.slug,
    fileKey: course.fileKey,
    category: course.category,
    price: course.price,
    status: course.status,
    enrollmentsCount: course.enrollment.length,
    revenue: course.enrollment.reduce((sum, e) => sum + e.amount, 0),
  }));

  return formatted
    .sort((a, b) => b.revenue - a.revenue || b.enrollmentsCount - a.enrollmentsCount)
    .slice(0, limit);
};
