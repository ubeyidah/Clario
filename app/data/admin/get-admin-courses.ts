import "server-only"
import { prisma } from "@/lib/db"
import { requireAdmin } from "./require-admin"


export const getAdminCourses = async (searchQuery?: string, category?: string, status?: string) => {
  await requireAdmin()

  // Build where clause for filtering
  const whereClause: Record<string, unknown> = {}

  // Add search filter
  if (searchQuery && searchQuery.trim()) {
    whereClause.OR = [
      { title: { contains: searchQuery.trim(), mode: 'insensitive' as const } },
      { shortDescription: { contains: searchQuery.trim(), mode: 'insensitive' as const } }
    ]
  }

  // Add category filter
  if (category && category !== 'all-courses') {
    whereClause.category = category
  }

  // Add status filter
  if (status && status !== 'all-status') {
    whereClause.status = status as 'Draft' | 'Published' | 'Archived'
  }

  // TODO: if later have multiple admins use admin or user id to filter courses
  const courses = await prisma.course.findMany({
    where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
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


