"use client";

import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [emailOTPClient()],
});

// Export typed hooks and methods
export const { signIn, signOut, useSession, getSession } = authClient;

// Email OTP specific methods
export const { sendVerificationOtp } = authClient.emailOtp;
