import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { env } from "@/lib/env";

export interface SystemHealthReport {
  database: {
    status: "healthy" | "degraded" | "down";
    latencyMs: number;
    totalUsers: number;
    totalSessions: number;
  };
  stripe: {
    configured: boolean;
    currency: string;
    mode: string;
  };
  storage: {
    configured: boolean;
    bucket: string;
    endpoint: string;
  };
  email: {
    configured: boolean;
    provider: string;
    sender: string;
  };
  arcjet: {
    configured: boolean;
    rules: string[];
  };
  system: {
    environment: string;
    nodeVersion: string;
    timestamp: string;
  };
}

export const getSystemHealth = async (): Promise<SystemHealthReport> => {
  await requireAdmin();

  // 1. Database Check
  let dbStatus: "healthy" | "degraded" | "down" = "healthy";
  let latencyMs = 0;
  let totalUsers = 0;
  let totalSessions = 0;

  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    latencyMs = Date.now() - start;

    [totalUsers, totalSessions] = await Promise.all([
      prisma.user.count(),
      prisma.session.count(),
    ]);
  } catch (error) {
    console.error("Database health check failed:", error);
    dbStatus = "down";
  }

  // 2. Stripe Check
  const stripeConfigured = Boolean(
    env.STRIPE_SECRET_KEY && !env.STRIPE_SECRET_KEY.includes("placeholder")
  );

  // 3. Storage Check
  const storageConfigured = Boolean(
    env.AWS_ACCESS_KEY_ID &&
      env.AWS_SECRET_ACCESS_KEY &&
      env.NEXT_PUBLIC_S3_BUCKET_NAME_IMG
  );

  // 4. Email Check
  const emailConfigured = Boolean(
    env.RESEND_API_KEY && env.RESEND_API_KEY !== "re_placeholder"
  );

  return {
    database: {
      status: dbStatus,
      latencyMs,
      totalUsers,
      totalSessions,
    },
    stripe: {
      configured: stripeConfigured,
      currency: "ETB",
      mode: env.NODE_ENV === "production" ? "Live" : "Test / Development",
    },
    storage: {
      configured: storageConfigured,
      bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMG || "Not configured",
      endpoint: env.AWS_ENDPOINT_URL_S3 || "Default AWS S3",
    },
    email: {
      configured: emailConfigured,
      provider: "Resend",
      sender: "Clario LMS <onboarding@resend.dev>",
    },
    arcjet: {
      configured: Boolean(env.ARCJET_KEY),
      rules: ["Bot Detection", "Sliding & Fixed Window Rate Limiting"],
    },
    system: {
      environment: env.NODE_ENV,
      nodeVersion: process.version,
      timestamp: new Date().toISOString(),
    },
  };
};
