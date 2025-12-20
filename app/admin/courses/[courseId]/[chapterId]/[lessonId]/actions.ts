"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import { prisma } from "@/lib/db"
import { ApiResponse, LessonSchema } from "@/lib/types"
import { lessonSchema } from "@/lib/zod-validation"

export const updateLesson = async (body: LessonSchema, lessonId: string): Promise<ApiResponse> => {
  await requireAdmin()
  try {
    const { success, data, error } = lessonSchema.safeParse(body)
    if (!success) {
      return {
        success: false,
        message: error.issues[0].message
      }
    }

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        title: data.name,
        description: data.description,
        thumbnailFileKey: data.thumbnailFileKey,
        videoFileKey: data.videoFileKey,
      }
    })

    return {
      success: false,
      message: "lesson updated successfully"
    }

  } catch {
    return {
      success: false,
      message: "Internal server error"
    }
  }
}
