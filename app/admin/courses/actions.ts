"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { Session } from "better-auth";
import { revalidatePath } from "next/cache";

const adminServer = async (fn:(session: any) => Promise<ApiResponse>): Promise<ApiResponse> => {
  const session = await requireAdmin()
   try {
    return await fn(session)
  } catch {
    return {
      message: "Internal server error",
      success: false
    }
  }
}

export const updateCourse = adminServer(async (session) => {
  console.log(session)
  return {
    success: false,
    message: "blah blah blah"
  }
})

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
