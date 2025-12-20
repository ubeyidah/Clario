import { prisma } from "@/lib/db"

export const getPublicCourses = async () => {
  const courses = await prisma.course.findMany({
    where: {
      status: "Published"
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      title: true,
      id: true,
      slug: true,
      shortDescription: true,
      fileKey: true,
      level: true,
      duration: true,
      category: true,
    }
  })
  return courses;
}


export type PublicCourse = Awaited<ReturnType<typeof getPublicCourses>>[0];
