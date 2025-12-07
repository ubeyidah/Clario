import { Resend } from 'resend';
import { env } from './env';
import { otpEmailTemplate } from './email/templates/otp-template';

const resend = new Resend(env.RESEND_API_KEY);

export const sendOtpEmail = async (email: string, otp: string) => {
    const name = email.split("@")[0];
    await resend.emails.send({
        from: 'Clario LMS <onboarding@resend.dev>',
        to: [email],
        subject: "Your Clario LMS Sign-In Code",
        html: otpEmailTemplate({ otp, userName: name }),
    });

}