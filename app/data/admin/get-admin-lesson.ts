import { prisma } from "@/lib/db"
import { requireAdmin } from "./require-admin"
import { notFound } from "next/navigation"

export const getAdminLesson = async (lessonId: string, chapterId: string) => {
  await requireAdmin()
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId, chapterId }, select: {
      videoFileKey: true,
      title: true,
      description: true,
      thumbnailFileKey: true,
      id: true,
      updatedAt: true,
    }
  })


  if (!lesson) return notFound()

  return lesson

}

export type AdminLesson = Awaited<ReturnType<typeof getAdminLesson>>
