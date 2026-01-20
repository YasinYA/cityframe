"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { analytics, identifyUser } from "@/lib/analytics/mixpanel";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { LoadingLogo } from "@/components/ui/loading-logo";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

// Prelaunch mode - auth page is not accessible
const IS_PRELAUNCH = process.env.NEXT_PUBLIC_PRELAUNCH === "true";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/app";

  const { sendOTP, verifyOTP, authenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to home in prelaunch mode
  useEffect(() => {
    if (IS_PRELAUNCH) {
      router.replace("/");
    }
  }, [router]);

  // Redirect if already authenticated
  useEffect(() => {
    if (authenticated && !authLoading) {
      router.replace(redirectTo);
    }
  }, [authenticated, authLoading, router, redirectTo]);

  // Show loading in prelaunch mode (while redirecting)
  if (IS_PRELAUNCH) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <LoadingLogo size="lg" text="Redirecting..." />
      </main>
    );
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    analytics.signUpStarted();

    try {
      await sendOTP(email);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await verifyOTP(email, otp);
      // Track sign in and identify user
      analytics.signInCompleted(email);
      identifyUser(user.id, email);

      toast.success("Welcome back!", {
        description: "You've been signed in successfully.",
      });

      // Redirect after successful auth
      router.replace(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <LoadingLogo size="lg" text="Loading..." />
      </main>
    );
  }

  // Don't render if authenticated (will redirect)
  if (authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <LoadingLogo size="lg" text="Redirecting..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Map Roads Pattern */}
      <div
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: `url("/road_layout.svg")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, hsl(var(--background)) 70%)',
        }}
      />

      <Card className="max-w-md w-full p-8 md:p-10 rounded-2xl border-2 shadow-xl relative z-10 bg-background/95 backdrop-blur-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Image
            src="/logo.webp"
            alt="City Frame"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <span className="font-extrabold text-xl tracking-tight">City Frame</span>
        </Link>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
              {step === "email" ? "Sign in" : "Enter verification code"}
            </h1>
            <p className="text-muted-foreground">
              {step === "email"
                ? "Enter your email to receive a sign-in code"
                : `We sent a code to ${email}`}
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-12"
              />
              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
              <Button type="submit" className="w-full h-12 rounded-xl font-semibold shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index] || ""}
                    disabled={isLoading}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      const newOtp = otp.split("");
                      newOtp[index] = value;
                      setOtp(newOtp.join("").slice(0, 6));
                      // Auto-focus next input if value entered
                      if (value && index < 5) {
                        document.getElementById(`otp-${index + 1}`)?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      // Handle backspace
                      if (e.key === "Backspace") {
                        if (otp[index]) {
                          // Clear current digit
                          const newOtp = otp.split("");
                          newOtp[index] = "";
                          setOtp(newOtp.join(""));
                        } else if (index > 0) {
                          // Move to previous input and clear it
                          const newOtp = otp.split("");
                          newOtp[index - 1] = "";
                          setOtp(newOtp.join(""));
                          document.getElementById(`otp-${index - 1}`)?.focus();
                        }
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                      setOtp(pastedData);
                      // Focus last filled or next empty input
                      const focusIndex = Math.min(pastedData.length, 5);
                      document.getElementById(`otp-${focusIndex}`)?.focus();
                    }}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all disabled:opacity-50"
                  />
                ))}
              </div>
              {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}
              <Button type="submit" className="w-full h-12 rounded-xl font-semibold shadow-lg shadow-primary/20" disabled={isLoading || otp.length !== 6}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Verify"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full h-11 rounded-xl font-medium hover:bg-primary/5 hover:text-foreground transition-all"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError("");
                }}
                disabled={isLoading}
              >
                Use a different email
              </Button>
            </form>
          )}
        </Card>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background">
          <LoadingLogo size="lg" text="Loading..." />
        </main>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
