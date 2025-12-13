"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse, CourseSchema } from "@/lib/types";
import { courseSchema } from "@/lib/zod-validation";
import { headers } from "next/headers";


export const createCourseA = async (body: CourseSchema): Promise<ApiResponse> => {
  try {
    const { success, data, error } = courseSchema.safeParse(body);

    if (!success) {
      return {
        success: false,
        message: error.issues[0].message
      }
    }
    const session = await auth.api.getSession({
      headers: await headers()
    })

    await prisma.course.create({
      data: {
        ...data, userId: session?.user.id as string
      }
    })
    return {
      success: true,
      message: "Course created successfully"
    }
  } catch {
    return {
      message: "Internal server error",
      success: false
    }
  }
}

