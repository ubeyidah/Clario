import { defineEnv, z } from "nviron"

export const env = defineEnv({
  DATABASE_URL: z.url(),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  ARCJET_KEY: z.string().startsWith("ajkey_"),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_ENDPOINT_URL_S3: z.url(),
  AWS_ENDPOINT_URL_IAM: z.url(),
  AWS_REGION: z.string(),
  NEXT_PUBLIC_S3_BUCKET_NAME_IMG: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string()
})
