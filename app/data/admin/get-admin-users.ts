import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  role: string | null;
  banned: boolean | null;
  _count: {
    enrollments: number;
    courses: number;
  };
};

export type UserListParams = {
  search?: string;
  role?: "admin" | "student" | "all";
  status?: "active" | "inactive" | "banned" | "all";
  page?: number;
  pageSize?: number;
};

export type UserListResult = {
  users: AdminUser[];
  total: number;
};

const buildWhereClause = (params: UserListParams) => {
  const where: any = {};

  // Search filter
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } }
    ];
  }

  // Role filter
  if (params.role && params.role !== "all") {
    where.role = params.role;
  }

  // Status filter - simplified as requested
  if (params.status && params.status !== "all") {
    if (params.status === "inactive") {
      where.banned = true;
    } else if (params.status === "active") {
      where.banned = false;
    }
  }

  return where;
};

export const getAdminUsers = cache(async (params: UserListParams = {}): Promise<UserListResult> => {
  await requireAdmin();

  const pageSize = params.pageSize || 10;
  const page = params.page || 0;

  const where = buildWhereClause(params);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        role: true,
        banned: true,
        _count: {
          select: {
            enrollments: true,
            courses: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: page * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where })
  ]);

  return { users, total };
});