
// import "server-only"
import { Resend } from 'resend';
import { env } from './env';
import { otpEmailTemplate } from './email/templates/otp-template';

const resend = new Resend(env.RESEND_API_KEY);

export const sendOtpEmail = async (email: string, otp: string) => {
  if (env.NODE_ENV === "development") {
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    return; // skip sending real email
  }
  const name = email.split("@")[0];
  await resend.emails.send({
    from: 'Clario LMS <onboarding@resend.dev>',
    to: [email],
    subject: "Your Clario LMS Sign-In Code",
    html: otpEmailTemplate({ otp, userName: name }),
  });

}
