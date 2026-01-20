"use client";

import dynamic from "next/dynamic";

// Lazy load the SignInModal content - only loads when modal is opened
const SignInModalContent = dynamic(
  () => import("./SignInModalContent").then((mod) => ({ default: mod.SignInModal })),
  { ssr: false }
);

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
}

export function SignInModal({ open, onOpenChange, redirectTo }: SignInModalProps) {
  // Only render the modal content when open to avoid loading the code eagerly
  if (!open) return null;

  return (
    <SignInModalContent
      open={open}
      onOpenChange={onOpenChange}
      redirectTo={redirectTo}
    />
  );
}
