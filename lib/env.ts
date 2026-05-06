import { defineEnv, z } from "nviron";

const isTest = process.env.NODE_ENV === "test";

export const env = isTest
  ? {
      DATABASE_URL: "postgresql://dummy",
      GITHUB_CLIENT_ID: "dummy",
      GITHUB_CLIENT_SECRET: "dummy",
      RESEND_API_KEY: "re_dummy",
      NODE_ENV: "test" as const,
      ARCJET_KEY: "ajkey_dummy",
      AWS_ACCESS_KEY_ID: "dummy",
      AWS_SECRET_ACCESS_KEY: "dummy",
      AWS_ENDPOINT_URL_S3: "https://dummy.s3.amazonaws.com",
      AWS_ENDPOINT_URL_IAM: "https://dummy.iam.amazonaws.com",
      AWS_REGION: "us-east-1",
      NEXT_PUBLIC_S3_BUCKET_NAME_IMG: "dummy-bucket",
      GOOGLE_CLIENT_ID: "dummy",
      GOOGLE_CLIENT_SECRET: "dummy",
      STRIPE_SECRET_KEY: "sk_test_dummy",
      BETTER_AUTH_URL: "https://dummy.com",
      STRIPE_WEBHOOK_SECRET: "whsec_dummy",
    }
  : defineEnv({
      DATABASE_URL: z.url(),
      GITHUB_CLIENT_ID: z.string().min(1),
      GITHUB_CLIENT_SECRET: z.string().min(1),
      RESEND_API_KEY: z.string().startsWith("re_").optional(),
      NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
      ARCJET_KEY: z.string().startsWith("ajkey_"),
      AWS_ACCESS_KEY_ID: z.string(),
      AWS_SECRET_ACCESS_KEY: z.string(),
      AWS_ENDPOINT_URL_S3: z.url(),
      AWS_ENDPOINT_URL_IAM: z.url(),
      AWS_REGION: z.string(),
      NEXT_PUBLIC_S3_BUCKET_NAME_IMG: z.string(),
      GOOGLE_CLIENT_ID: z.string().min(1),
      GOOGLE_CLIENT_SECRET: z.string().min(1),
      STRIPE_SECRET_KEY: z.string().min(1),
      BETTER_AUTH_URL: z.url(),
      STRIPE_WEBHOOK_SECRET: z.string().min(1),
    });
