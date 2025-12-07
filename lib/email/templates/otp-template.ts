interface OTPTemplateProps {
  otp: string;
  userName?: string;
  expiryMinutes?: number;
}

export function otpEmailTemplate({
  otp,
  userName = "User",
  expiryMinutes = 5,
}: OTPTemplateProps) {
  return `
  <html>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background: radial-gradient(circle at top left, #28a745, #7de1a3);">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: 2rem;">
            <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; padding: 2rem; text-align:center;">
              <tr>
                <td>
                  <h2 style="color:#131308; margin-bottom:0.5rem;">Clario LMS</h2>
                  <p style="font-size: 1rem; color:#333;">Hello ${userName},</p>
                  <p style="font-size: 1rem; color:#333; margin-top:0.5rem;">Use the OTP below to sign in. This code is valid for <strong>${expiryMinutes} minutes</strong>.</p>
                  <h1 style="font-size: 2rem; color:#28a745; margin: 1rem 0; letter-spacing: 4px;">${otp}</h1>
                  <p style="font-size: 0.9rem; color:#555;">If you did not request this, please ignore this email.</p>
                  <p style="margin-top:2rem; font-size: 0.75rem; color:#888;">&copy; 2025 Clario LMS. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}
