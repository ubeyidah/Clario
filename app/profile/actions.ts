"use server";

import { getFullSession, requireUser } from "@/app/data/user/require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { updateProfileSchema } from "@/lib/zod-validation";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 30,
  })
);

export const updateProfileA = async (
  values: { name: string; image?: string | null }
): Promise<ApiResponse<{ name: string; image?: string | null }>> => {
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

    const { success, error, data } = updateProfileSchema.safeParse(values);
    if (!success) {
      return {
        success: false,
        message: error.issues[0]?.message || "Invalid input data",
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name.trim(),
        image: data.image ?? null,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/");

    return {
      success: true,
      message: "Profile updated successfully.",
      data: {
        name: data.name,
        image: data.image,
      },
    };
  } catch (err) {
    console.error("Error updating profile:", err);
    return {
      success: false,
      message: "Failed to update profile. Please try again.",
    };
  }
};

export const revokeOwnSessionA = async (
  sessionId: string
): Promise<ApiResponse<{ revokedId: string }>> => {
  const { session, user } = await getFullSession();

  try {
    // Ensure the session being deleted belongs to this user
    const targetSession = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { id: true, userId: true },
    });

    if (!targetSession || targetSession.userId !== user.id) {
      return {
        success: false,
        message: "Session not found or access denied.",
      };
    }

    if (targetSession.id === session.id) {
      return {
        success: false,
        message: "You cannot revoke your active current session from here. Use Sign Out instead.",
      };
    }

    await prisma.session.delete({
      where: { id: sessionId },
    });

    revalidatePath("/profile");

    return {
      success: true,
      message: "Session revoked successfully.",
      data: { revokedId: sessionId },
    };
  } catch (err) {
    console.error("Error revoking session:", err);
    return {
      success: false,
      message: "Failed to revoke session.",
    };
  }
};

export const revokeOtherSessionsA = async (): Promise<ApiResponse<{ count: number }>> => {
  const { session, user } = await getFullSession();

  try {
    const result = await prisma.session.deleteMany({
      where: {
        userId: user.id,
        id: { not: session.id },
      },
    });

    revalidatePath("/profile");

    return {
      success: true,
      message: `Revoked ${result.count} other session${result.count !== 1 ? "s" : ""}.`,
      data: { count: result.count },
    };
  } catch (err) {
    console.error("Error revoking other sessions:", err);
    return {
      success: false,
      message: "Failed to revoke other sessions.",
    };
  }
};
