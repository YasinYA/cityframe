import { Resend } from "resend";

// Lazy-load Resend to avoid errors when API key is not set
let resendClient: Resend | null = null;

export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured. Please add it to your .env file.");
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// OTP settings
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;

// Generate a random OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simple in-memory store for OTPs (in production, use Redis or database)
// Use global to persist across Next.js hot reloads in development
const globalForOtp = globalThis as unknown as {
  otpStore: Map<string, { otp: string; expires: number }> | undefined;
};

const otpStore = globalForOtp.otpStore ?? new Map<string, { otp: string; expires: number }>();

if (process.env.NODE_ENV !== "production") {
  globalForOtp.otpStore = otpStore;
}

export function storeOTP(email: string, otp: string): void {
  const expires = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
  otpStore.set(email.toLowerCase(), { otp, expires });
  console.log("Stored OTP for", email.toLowerCase(), ":", otp);
}

export function verifyOTP(email: string, otp: string): boolean {
  console.log("Verifying OTP for", email.toLowerCase(), "input:", otp);
  console.log("Stored OTPs:", Array.from(otpStore.entries()));

  const stored = otpStore.get(email.toLowerCase());
  if (!stored) {
    console.log("No OTP found for this email");
    return false;
  }
  if (Date.now() > stored.expires) {
    console.log("OTP expired");
    otpStore.delete(email.toLowerCase());
    return false;
  }
  if (stored.otp !== otp) {
    console.log("OTP mismatch - expected:", stored.otp, "got:", otp);
    return false;
  }
  otpStore.delete(email.toLowerCase());
  console.log("OTP verified successfully");
  return true;
}

// Session token (simple JWT-like approach using signed cookies)
export const SESSION_COOKIE_NAME = "cityframe_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
