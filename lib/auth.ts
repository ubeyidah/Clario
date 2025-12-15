import "server-only"
import { betterAuth } from "better-auth";
import { env } from "./env";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { admin, emailOTP } from "better-auth/plugins"
import { sendOtpEmail } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await sendOtpEmail(email, otp)
      },
    }),
    admin()
  ]
});
