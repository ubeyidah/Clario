"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { getAdminUsers, type UserListParams, type AdminUser } from "@/app/data/admin/get-admin-users";

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

export const getUserDetailA = async (userId: string): Promise<UserDetail | null> => {
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
};

export const exportUsersAsCSV = async (params: UserListParams): Promise<string> => {
  await requireAdmin();

  const { users } = await getAdminUsers(params);

  const headers = [
    'ID',
    'Name',
    'Email',
    'Email Verified',
    'Role',
    'Status',
    'Joined',
    'Enrolled Courses',
    'Courses Created'
  ];

  const csvData = users.map((user: AdminUser) => [
    user.id,
    user.name,
    user.email,
    user.emailVerified ? 'Yes' : 'No',
    user.role || '',
    user.banned ? 'Banned' : 'Active',
    user.createdAt.toISOString(),
    user._count.enrollments,
    user._count.courses
  ]);

  const csvContent = [headers, ...csvData]
    .map((row: (string | number | boolean)[]) => row.map((field: string | number | boolean) => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
};

export const exportUsersAsJSON = async (params: UserListParams): Promise<string> => {
  await requireAdmin();

  const { users } = await getAdminUsers(params);

  const jsonData = users.map((user: AdminUser) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    role: user.role,
    status: user.banned ? 'banned' : 'active',
    createdAt: user.createdAt.toISOString(),
    enrolledCourses: user._count.enrollments,
    coursesCreated: user._count.courses
  }));

  return JSON.stringify(jsonData, null, 2);
};

export type UserSession = {
  id: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  impersonatedBy: string | null;
};

export const getUserSessions = async (userId: string): Promise<UserSession[]> => {
  "use server";
  await requireAdmin();
  
  const sessions = await prisma.session.findMany({
    where: { userId },
    select: {
      id: true,
      token: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
      ipAddress: true,
      userAgent: true,
      impersonatedBy: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return sessions;
};

export const revokeUserSession = async (sessionId: string) => {
  "use server";
  await requireAdmin();

  await prisma.session.delete({
    where: { id: sessionId },
  });
};

export const revokeAllUserSessions = async (userId: string) => {
  "use server";
  await requireAdmin();

  await prisma.session.deleteMany({
    where: { userId },
  });
};