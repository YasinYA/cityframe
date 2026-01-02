"use client";

import { useState, useEffect, useCallback } from "react";
import { SessionResponse } from "@/app/api/auth/session/route";

export function useAuth() {
  const [session, setSession] = useState<SessionResponse>({
    authenticated: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/session");
      if (response.ok) {
        const data = await response.json();
        setSession(data);
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const sendOTP = async (email: string) => {
    const response = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to send code");
    }

    return true;
  };

  const verifyOTP = async (email: string, otp: string) => {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Verification failed");
    }

    const data = await response.json();
    setSession({
      authenticated: true,
      user: data.user,
    });

    return data.user;
  };

  const signOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setSession({ authenticated: false, user: null });
  };

  return {
    ...session,
    isLoading,
    sendOTP,
    verifyOTP,
    signOut,
    refresh: fetchSession,
  };
}
