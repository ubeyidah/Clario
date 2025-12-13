"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import { prisma } from "@/lib/db"
import { ApiResponse, CourseSchema } from "@/lib/types"
import { courseSchema } from "@/lib/zod-validation"

export const updateCourseA = async (id: string, body: CourseSchema): Promise<ApiResponse> => {
  const session = await requireAdmin()
  try {
    const { success, data, error } = courseSchema.safeParse(body);
    if (!success) {
      return {
        success: false,
        message: error.issues[0].message
      }
    }

    await prisma.course.update({
      where: { id, userId: session.user.id },
      data
    })

    return {
      message: "Course updated successfully",
      success: true
    }
  } catch {
    return {
      message: "Internal server error",
      success: false
    }
  }
}
