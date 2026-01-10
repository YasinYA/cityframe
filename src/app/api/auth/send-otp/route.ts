import { NextRequest, NextResponse } from "next/server";
import { getResend, generateOTP, storeOTP } from "@/lib/auth/config";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    storeOTP(email, otp);

    // Send email with OTP
    const resend = getResend();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cityframe.app";
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "CityFrame <info@cityframe.app>",
      to: email,
      subject: "Your CityFrame verification code",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="${appUrl}/logo.webp" alt="CityFrame" style="height: 48px; width: auto;" />
          </div>

          <!-- Content -->
          <h2 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 24px; font-weight: 600; text-align: center;">
            Verify your email
          </h2>
          <p style="color: #666666; margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; text-align: center;">
            Enter this code to sign in to CityFrame:
          </p>

          <!-- OTP Code -->
          <div style="background: #f8f8f8; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a1a1a; font-family: monospace;">
              ${otp}
            </span>
          </div>

          <p style="color: #999999; font-size: 14px; line-height: 1.5; text-align: center; margin: 0 0 32px 0;">
            This code expires in 10 minutes.<br />
            If you didn't request this, you can safely ignore this email.
          </p>

          <!-- Divider -->
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 32px 0;" />

          <!-- Footer -->
          <div style="text-align: center;">
            <p style="color: #999999; font-size: 13px; margin: 0 0 8px 0;">
              CityFrame - Premium City Wallpapers
            </p>
            <p style="color: #999999; font-size: 13px; margin: 0;">
              Questions? Contact us at <a href="mailto:info@cityframe.app" style="color: #666666;">info@cityframe.app</a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return NextResponse.json(
        { error: "Failed to send verification email: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
