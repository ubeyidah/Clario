import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { Prisma } from "@/lib/generated/prisma/client";

export interface EnrollmentListParams {
  search?: string;
  status?: "ACTIVE" | "PENDING" | "CANCELED" | "all";
  page?: number;
  pageSize?: number;
}

export const getAdminEnrollments = async (
  params: EnrollmentListParams = {}
) => {
  await requireAdmin();

  const pageSize = params.pageSize || 20;
  const page = params.page || 0;

  const where: Prisma.EnrollmentWhereInput = {};

  if (params.search && params.search.trim()) {
    const q = params.search.trim();
    where.OR = [
      {
        user: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        },
      },
      {
        course: {
          title: { contains: q, mode: "insensitive" },
        },
      },
    ];
  }

  if (params.status && params.status !== "all") {
    where.status = params.status;
  }

  const [enrollments, total, totalActiveAmount] = await Promise.all([
    prisma.enrollment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: page * pageSize,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            stripeCustomerId: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            fileKey: true,
            price: true,
          },
        },
      },
    }),
    prisma.enrollment.count({ where }),
    prisma.enrollment.aggregate({
      where: { ...where, status: "ACTIVE" },
      _sum: { amount: true },
    }),
  ]);

  return {
    enrollments,
    total,
    totalRevenue: totalActiveAmount._sum.amount || 0,
    page,
    pageSize,
  };
};

export type AdminEnrollmentsResult = Awaited<
  ReturnType<typeof getAdminEnrollments>
>;
