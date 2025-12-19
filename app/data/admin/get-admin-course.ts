import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getAdminCourse = async (id: string) => {
  await requireAdmin();
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      chapters: {
        select: {
          id: true,
          title: true,
          position: true,
          createdAt: true,
          updatedAt: true,
          lessons: true,
        }
      }
    }
  });
  if (!course) {
    return notFound();
  }
  return course;
}
export type AdminCourseType = Awaited<ReturnType<typeof getAdminCourse>>
