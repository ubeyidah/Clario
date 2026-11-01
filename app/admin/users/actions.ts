"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { getAdminUsers, type UserListParams, type AdminUser } from "@/app/data/admin/get-admin-users";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY || "re_placeholder");

export interface UserEnrolledCourse {
  courseId: string;
  title: string;
  category: string;
  fileKey: string;
  status: "ACTIVE" | "PENDING" | "CANCELED";
  amount: number;
  enrolledAt: Date;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
}

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
  activeEnrollments: number;
  totalSpent: number;
  coursesCreated?: number;
  enrolledCoursesList: UserEnrolledCourse[];
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
        },
      },
    },
  });

  if (!user) return null;

  // Get total logins from sessions count
  const totalLogins = await prisma.session.count({
    where: { userId },
  });

  // Get enrollments with course and chapter data
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          category: true,
          fileKey: true,
          chapters: {
            select: {
              lessons: {
                select: { id: true },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch all completed lessons by this user
  const completedLessonRecords = await prisma.lessonProgress.findMany({
    where: {
      userId,
      completed: true,
    },
    select: { lessonId: true },
  });
  const completedLessonSet = new Set(completedLessonRecords.map((r) => r.lessonId));

  const enrolledCoursesList: UserEnrolledCourse[] = enrollments.map((enr) => {
    const courseLessons: string[] = [];
    for (const ch of enr.course.chapters) {
      for (const les of ch.lessons) {
        courseLessons.push(les.id);
      }
    }
    const totalLessons = courseLessons.length;
    let completedLessons = 0;
    for (const lId of courseLessons) {
      if (completedLessonSet.has(lId)) {
        completedLessons++;
      }
    }
    const progressPercentage =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      courseId: enr.course.id,
      title: enr.course.title,
      category: enr.course.category,
      fileKey: enr.course.fileKey,
      status: enr.status as "ACTIVE" | "PENDING" | "CANCELED",
      amount: enr.amount,
      enrolledAt: enr.createdAt,
      completedLessons,
      totalLessons,
      progressPercentage,
    };
  });

  const enrolledCourses = enrollments.length;
  const activeEnrollments = enrollments.filter((e) => e.status === "ACTIVE").length;
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
    activeEnrollments,
    totalSpent,
    coursesCreated,
    enrolledCoursesList,
  };
};

export const sendAdminEmailA = async ({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) => {
  const session = await requireAdmin();

  if (!to || !subject.trim() || !message.trim()) {
    throw new Error("Recipient, subject, and message are required");
  }

  if (env.NODE_ENV === "development" || env.RESEND_API_KEY === "re_placeholder") {
    console.log(`[ADMIN EMAIL DEV] From: ${session.user.email} -> To: ${to}\nSubject: ${subject}\n${message}`);
    return { success: true, message: `Email delivered (dev mode) to ${to}` };
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; rounded: 8px;">
      <h2 style="color: #10b981; margin-bottom: 8px;">Clario LMS</h2>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 16px 0;" />
      <p style="white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #333;">${message}</p>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
      <p style="font-size: 12px; color: #888;">This message was sent by a Clario administrator (${session.user.name || session.user.email}).</p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: "Clario LMS <onboarding@resend.dev>",
    to: [to],
    subject,
    html,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return { success: true, message: `Email sent successfully to ${to}` };
};

export const updateUserRoleA = async (userId: string, newRole: "admin" | "student") => {
  const session = await requireAdmin();

  if (session.user.id === userId) {
    throw new Error("You cannot change your own role");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath("/admin/users");
  return { success: true, message: `User role updated to ${newRole}` };
};

export const exportUsersAsCSV = async (params: UserListParams): Promise<string> => {
  await requireAdmin();

  const { users } = await getAdminUsers(params);

  const headers = [
    "ID",
    "Name",
    "Email",
    "Email Verified",
    "Role",
    "Status",
    "Joined",
    "Enrolled Courses",
    "Courses Created",
  ];

  const csvData = users.map((user: AdminUser) => [
    user.id,
    user.name,
    user.email,
    user.emailVerified ? "Yes" : "No",
    user.role || "student",
    user.banned ? "Banned" : "Active",
    user.createdAt.toISOString(),
    user._count.enrollments,
    user._count.courses,
  ]);

  const csvContent = [headers, ...csvData]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

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
    role: user.role || "student",
    status: user.banned ? "banned" : "active",
    createdAt: user.createdAt.toISOString(),
    enrolledCourses: user._count.enrollments,
    coursesCreated: user._count.courses,
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
  await requireAdmin();

  await prisma.session.delete({
    where: { id: sessionId },
  });
};

export const revokeAllUserSessions = async (userId: string) => {
  await requireAdmin();

  await prisma.session.deleteMany({
    where: { userId },
  });
};
