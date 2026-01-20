"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { analytics, identifyUser } from "@/lib/analytics/mixpanel";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
}

export function SignInModal({ open, onOpenChange, redirectTo }: SignInModalProps) {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = authClient.useSession();

  // Redirect if already authenticated
  useEffect(() => {
    if (open && session && !isSessionLoading) {
      onOpenChange(false);
      router.push(redirectTo || "/app");
    }
  }, [open, session, isSessionLoading, onOpenChange, router, redirectTo]);

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    analytics.signUpStarted();

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (error) {
        throw new Error(error.message || "Failed to send code");
      }

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
      const { data, error } = await authClient.signIn.emailOtp({
        email,
        otp,
      });

      if (error) {
        throw new Error(error.message || "Verification failed");
      }

      if (data?.user) {
        // Track sign in and identify user
        analytics.signInCompleted(email);
        identifyUser(data.user.id, email);

        toast.success("Welcome back!", {
          description: "You've been signed in successfully.",
        });

        onOpenChange(false);
        // Reset state
        setStep("email");
        setEmail("");
        setOtp("");
        // Redirect to specified path or default to /app
        router.push(redirectTo || "/app");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setStep("email");
      setEmail("");
      setOtp("");
      setError("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-center">
            {step === "email" ? "Sign in to City Frame" : "Enter verification code"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === "email"
              ? "Enter your email to receive a sign-in code"
              : `We sent a code to ${email}`}
          </DialogDescription>
        </DialogHeader>

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
              onClick={() => setStep("email")}
              disabled={isLoading}
            >
              Use a different email
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
