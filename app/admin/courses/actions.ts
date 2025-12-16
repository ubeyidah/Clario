"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const deleteCourseA = async (id: string): Promise<ApiResponse> => {
  const session = await requireAdmin()
  try {
    if (!id) {
      return {
        success: false,
        message: "course id is required"
      }
    }
    await prisma.course.delete({
      where: {
        id,
        userId: session.user.id
      }
    })

    revalidatePath("/admin/courses")
    return {
      success: true,
      message: "Course deleted sucessfully"
    }
  } catch {
    return {
      message: "Internal server error",
      success: false
    }
  }
}
