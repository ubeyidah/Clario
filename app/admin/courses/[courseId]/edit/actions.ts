"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet"
import { prisma } from "@/lib/db"
import { ApiResponse, CourseSchema, ChapterSchema, LessonSchema } from "@/lib/types"
import { chapterSchema, courseSchema, lessonSchema } from "@/lib/zod-validation"
import { request } from "@arcjet/next"
import { revalidatePath } from "next/cache"

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



export const reorderLessonsA = async (courseId: string, lessons: { id: string, position: number }[], chapterId: string): Promise<ApiResponse> => {
  await requireAdmin()
  try {

    if (!lessons || lessons.length == 0) return {
      success: false,
      message: "No lessons to reorder"
    }
    const updates = lessons.map(lesson => prisma.lesson.update({ where: { id: lesson.id, chapterId }, data: { position: lesson.position } }))

    await prisma.$transaction(updates)
    revalidatePath(`/admin/courses/${courseId}/edit`)
    return {
      message: "lessons reordered successfully",
      success: true
    }
  } catch {
    return {
      message: "Internal server error",
      success: false
    }
  }
}

export const reorderChaptersA = async (courseId: string, chapters: { id: string, position: number }[]): Promise<ApiResponse> => {
  await requireAdmin()
  try {

    if (!chapters || chapters.length == 0) return {
      success: false,
      message: "No chapters to reorder"
    }
    const updates = chapters.map(chapter => prisma.chapter.update({ where: { id: chapter.id, courseId }, data: { position: chapter.position } }))

    await prisma.$transaction(updates)
    revalidatePath(`/admin/courses/${courseId}/edit`)
    return {
      message: "chapters reordered successfully",
      success: true
    }
  } catch {
    return {
      message: "Internal server error",
      success: false
    }
  }
}




export const createChapterA = async (body: ChapterSchema): Promise<ApiResponse> => {
  await requireAdmin()
  try {
    const { data, success, error } = chapterSchema.safeParse(body);
    if (!success) {
      return {
        message: error.issues[0].message,
        success: false
      }
    }

    const { courseId, name } = data;
    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.chapter.findFirst({ where: { courseId }, select: { position: true }, orderBy: { position: 'desc' } })
      await tx.chapter.create({
        data: {
          title: name,
          courseId,
          position: (maxPosition?.position || 0) + 1
        }
      })
    })

    revalidatePath(`/admin/courses/${courseId}/edit`)

    return {
      message: "chapters created successfully",
      success: true
    }
  } catch {
    return {
      message: "Internal server error",
      success: false
    }
  }
}



export const createLessonA = async (body: LessonSchema): Promise<ApiResponse> => {
  await requireAdmin()
  try {
    const { data, success, error } = lessonSchema.safeParse(body);
    if (!success) {
      return {
        message: error.issues[0].message,
        success: false
      }
    }

    const { courseId, name, chapterId } = data;
    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.lesson.findFirst({ where: { chapterId }, select: { position: true }, orderBy: { position: 'desc' } })
      await tx.lesson.create({
        data: {
          title: name,
          chapterId,
          position: (maxPosition?.position || 0) + 1
        }
      })
    })

    revalidatePath(`/admin/courses/${courseId}/edit`)

    return {
      message: "lesson created successfully",
      success: true
    }
  } catch {
    return {
      message: "Internal server error",
      success: false
    }
  }
}
