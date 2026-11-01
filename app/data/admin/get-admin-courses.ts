import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { Prisma } from "@/lib/generated/prisma/client";

export interface AdminCourseFilterParams {
  search?: string;
  category?: string;
  status?: "Draft" | "Published" | "Archived" | "all";
}

export const getAdminCourses = async (
  params: AdminCourseFilterParams = {}
) => {
  await requireAdmin();

  const where: Prisma.CourseWhereInput = {};

  if (params.search && params.search.trim()) {
    const q = params.search.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
    ];
  }

  if (params.category && params.category !== "all-courses" && params.category !== "All Courses") {
    where.category = { equals: params.category, mode: "insensitive" };
  }

  if (params.status && params.status !== "all") {
    where.status = params.status;
  }

  const courses = await prisma.course.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      shortDescription: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      category: true,
      slug: true,
      status: true,
      stripePriceId: true,
      stripeProductId: true,
      userId: true,
      createdAt: true,
      _count: {
        select: {
          enrollment: {
            where: { status: "ACTIVE" },
          },
          chapters: true,
        },
      },
    },
  });

  return courses;
};

export type AdminCoursesType = Awaited<ReturnType<typeof getAdminCourses>>[0];
