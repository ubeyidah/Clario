import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"

export const getCourseBySlug = async (slug: string) => {
  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
      status: "Published"
    },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      shortDescription: true,
      fileKey: true,
      price: true,
      level: true,
      category: true,
      duration: true,
      createdAt: true,
      chapters: {
        select: {
          id: true,
          title: true,
          lessons: {
            select: {
              id: true,
              title: true,
            },
            orderBy: {
              position: "asc"
            }
          }
        },
        orderBy: {
          position: "asc"
        }
      }
    }

  })

  if (!course) return notFound()
  return course
}


export type PublicCourseDetail = Awaited<ReturnType<typeof getCourseBySlug>>
