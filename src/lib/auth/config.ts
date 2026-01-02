import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// OTP settings
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;

// Generate a random OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simple in-memory store for OTPs (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expires: number }>();

export function storeOTP(email: string, otp: string): void {
  const expires = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
  otpStore.set(email.toLowerCase(), { otp, expires });
}

export function verifyOTP(email: string, otp: string): boolean {
  const stored = otpStore.get(email.toLowerCase());
  if (!stored) return false;
  if (Date.now() > stored.expires) {
    otpStore.delete(email.toLowerCase());
    return false;
  }
  if (stored.otp !== otp) return false;
  otpStore.delete(email.toLowerCase());
  return true;
}

// Session token (simple JWT-like approach using signed cookies)
export const SESSION_COOKIE_NAME = "cityframe_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
