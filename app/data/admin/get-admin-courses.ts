import "server-only"
import { prisma } from "@/lib/db"
import { requireAdmin } from "./require-admin"


export const getAdminCourses = async () => {
  await requireAdmin()

  // TODO: if later have multiple admins use admin or user id to filter courses
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    omit: {
      description: true,
      updatedAt: true,
      createdAt: true,
    }
  })

  return courses
}


export type AdminCoursesType = Awaited<ReturnType<typeof getAdminCourses>>[0]


