import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db/client";
import { Resend } from "resend";

// Lazy-load Resend client
let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  appName: "City Frame",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: false, // We only use email OTP
  },
  plugins: [
    nextCookies(),
    emailOTP({
      otpLength: 6,
      expiresIn: 600, // 10 minutes
      allowedAttempts: 5,
      disableSignUp: false, // Allow new users to sign up via OTP
      async sendVerificationOTP({ email, otp, type }) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cityframe.app";
        const resend = getResend();

        let subject = "Your City Frame verification code";
        let heading = "Verify your email";
        let description = "Enter this code to sign in to City Frame:";

        if (type === "email-verification") {
          subject = "Verify your City Frame email";
          heading = "Verify your email";
          description = "Enter this code to verify your email address:";
        } else if (type === "forget-password") {
          subject = "Reset your City Frame password";
          heading = "Reset your password";
          description = "Enter this code to reset your password:";
        }

        // Don't await to prevent timing attacks
        resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "City Frame <info@cityframe.app>",
          to: email,
          subject,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
              <!-- Logo -->
              <div style="text-align: center; margin-bottom: 32px;">
                <img src="${appUrl}/logo.webp" alt="City Frame" style="height: 48px; width: auto;" />
              </div>

              <!-- Content -->
              <h2 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 24px; font-weight: 600; text-align: center;">
                ${heading}
              </h2>
              <p style="color: #666666; margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; text-align: center;">
                ${description}
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
                  City Frame - Premium City Wallpapers
                </p>
                <p style="color: #999999; font-size: 13px; margin: 0;">
                  Questions? Contact us at <a href="mailto:info@cityframe.app" style="color: #666666;">info@cityframe.app</a>
                </p>
              </div>
            </div>
          `,
        }).catch((error) => {
          console.error("Failed to send OTP email:", error);
        });
      },
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1 minute cache
    },
  },
  rateLimit: {
    window: 60, // 1 minute
    max: 10, // 10 requests per minute
  },
  advanced: {
    cookiePrefix: "cityframe",
  },
});

// Export auth types
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
