"use server";

import { requireUser } from "@/app/data/user/require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { lessonProgressSchema } from "@/lib/zod-validation";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 60,
  }),
);

export const toggleLessonProgressA = async (
  lessonId: string,
  completed: boolean,
): Promise<ApiResponse<{ completed: boolean }>> => {
  const user = await requireUser();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user.id,
    });

    if (decision.isDenied()) {
      return {
        success: false,
        message: "Too many requests. Please slow down.",
      };
    }

    const { success, error } = lessonProgressSchema.safeParse({
      lessonId,
      completed,
    });

    if (!success) {
      return {
        success: false,
        message: error.issues[0]?.message || "Invalid input",
      };
    }

    // Verify lesson exists and retrieve courseId
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        chapter: {
          select: {
            courseId: true,
          },
        },
      },
    });

    if (!lesson) {
      return {
        success: false,
        message: "Lesson not found.",
      };
    }

    const courseId = lesson.chapter.courseId;

    // Verify active enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
      select: {
        status: true,
      },
    });

    if (!enrollment || enrollment.status !== "ACTIVE") {
      return {
        success: false,
        message: "You are not actively enrolled in this course.",
      };
    }

    // Upsert lesson progress
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      create: {
        userId: user.id,
        lessonId,
        completed,
        completedAt: completed ? new Date() : null,
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/learn/${courseId}`);
    revalidatePath(`/learn/${courseId}/${lessonId}`);

    return {
      success: true,
      message: completed
        ? "Lesson marked as complete."
        : "Lesson marked as incomplete.",
      data: {
        completed,
      },
    };
  } catch (err) {
    console.error("Error in toggleLessonProgressA:", err);
    return {
      success: false,
      message: "Internal server error. Please try again.",
    };
  }
};
