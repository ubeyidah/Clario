import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export type UserDetail = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  lastLogin: string | null;
  totalLogins: number;
  enrolledCourses: number;
  completedCourses: number;
  totalSpent: number;
  coursesCreated?: number;
};

export const getUserDetail = cache(async (userId: string): Promise<UserDetail | null> => {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      role: true,
      banned: true,
      banReason: true,
      banExpires: true,
      sessions: {
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      _count: {
        select: {
          enrollments: true,
          courses: true,
        }
      }
    },
  });

  if (!user) return null;

  // Get total logins from sessions count
  const totalLogins = await prisma.session.count({
    where: { userId },
  });

  // Get enrollments with completion data
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    select: {
      status: true,
      amount: true,
    },
  });

  const enrolledCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => e.status === "ACTIVE").length;
  const totalSpent = enrollments.reduce((sum, e) => sum + e.amount, 0);

  const coursesCreated = user.role === "admin" ? user._count.courses : undefined;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role,
    banned: user.banned,
    banReason: user.banReason,
    banExpires: user.banExpires,
    lastLogin: user.sessions[0]?.createdAt?.toISOString() || null,
    totalLogins,
    enrolledCourses,
    completedCourses,
    totalSpent,
    coursesCreated,
  };
});