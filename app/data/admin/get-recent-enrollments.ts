import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export interface RecentEnrollmentItem {
  id: string;
  amount: number;
  status: "ACTIVE" | "PENDING" | "CANCELED";
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  course: {
    id: string;
    title: string;
    slug: string;
    category: string;
    fileKey: string;
    price: number;
  };
}

export const getRecentEnrollments = async (
  take = 10
): Promise<RecentEnrollmentItem[]> => {
  await requireAdmin();

  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      amount: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
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
  });

  return enrollments as RecentEnrollmentItem[];
};
