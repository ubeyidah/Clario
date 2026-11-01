"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const updateCourseStatusA = async (
  id: string,
  status: "Draft" | "Published" | "Archived"
): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) {
      return {
        success: false,
        message: "Course ID is required",
      };
    }

    await prisma.course.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${id}`);
    revalidatePath(`/courses`);

    return {
      success: true,
      message: `Course status updated to ${status}`,
    };
  } catch (error) {
    console.error("Failed to update course status:", error);
    return {
      success: false,
      message: "Failed to update course status",
    };
  }
};

export const deleteCourseA = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();
  try {
    if (!id) {
      return {
        success: false,
        message: "Course ID is required",
      };
    }
    await prisma.course.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath("/admin");
    return {
      success: true,
      message: "Course deleted successfully",
    };
  } catch {
    return {
      message: "Internal server error",
      success: false,
    };
  }
};
