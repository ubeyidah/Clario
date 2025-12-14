"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet"
import { prisma } from "@/lib/db"
import { ApiResponse, CourseSchema } from "@/lib/types"
import { courseSchema } from "@/lib/zod-validation"
import { request } from "@arcjet/next"

const aj = arcjet.withRule(detectBot({
  mode: "LIVE",
  allow: []
})).withRule(fixedWindow({
  mode: "LIVE",
  window: "5m",
  max: 3
})) // in 5 minute max 3 requests

export const updateCourseA = async (id: string, body: CourseSchema): Promise<ApiResponse> => {
  const session = await requireAdmin()
  try {
    const req = await request()
    const decision = await aj.protect(req, {
      fingerprint: session.user.id
    })
    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        return { success: false, message: "We detected automated or unusual activity.", }
      } else if (decision.reason.isRateLimit()) {
        return { success: false, message: "Please wait a few seconds before trying again.", }
      } else {
        return { success: false, message: "Forbidden" }
      }
    }

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
