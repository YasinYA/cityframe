"use client";

import { useCallback } from "react";
import { authClient } from "@/lib/auth-client";

export function useAuth() {
  const { data: session, isPending: isLoading, error } = authClient.useSession();

  const sendOTP = useCallback(async (email: string) => {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });

    if (error) {
      throw new Error(error.message || "Failed to send code");
    }

    return true;
  }, []);

  const verifyOTP = useCallback(async (email: string, otp: string) => {
    const { data, error } = await authClient.signIn.emailOtp({
      email,
      otp,
    });

    if (error) {
      throw new Error(error.message || "Verification failed");
    }

    return data?.user || null;
  }, []);

  const signOut = useCallback(async () => {
    await authClient.signOut();
  }, []);

  const refresh = useCallback(async () => {
    // Better Auth handles session refresh automatically
    // This is kept for interface compatibility
  }, []);

  return {
    authenticated: !!session?.user,
    user: session?.user || null,
    isLoading,
    error,
    sendOTP,
    verifyOTP,
    signOut,
    refresh,
  };
}
