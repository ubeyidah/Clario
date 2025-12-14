import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getAdminCourse = async (id: string) => {
  await requireAdmin();
  const course = await prisma.course.findUnique({ where: { id } })
  if (!course) {
    return notFound();
  }
  return course;
}
