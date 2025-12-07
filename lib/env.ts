import { defineEnv, z } from "nviron"

export const env = defineEnv({
  DATABASE_URL: z.url(),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  ARCJET_KEY: z.string().startsWith("ajkey_")
})
