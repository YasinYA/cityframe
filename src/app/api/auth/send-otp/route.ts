import { NextRequest, NextResponse } from "next/server";
import { resend, generateOTP, storeOTP } from "@/lib/auth/config";

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
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "CityFrame <noreply@cityframe.app>",
      to: email,
      subject: "Your CityFrame verification code",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Verify your email</h2>
          <p style="color: #666; margin-bottom: 20px;">
            Enter this code to sign in to CityFrame:
          </p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">
              ${otp}
            </span>
          </div>
          <p style="color: #999; font-size: 14px;">
            This code expires in 10 minutes. If you didn't request this, you can ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return NextResponse.json(
        { error: "Failed to send verification email" },
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
