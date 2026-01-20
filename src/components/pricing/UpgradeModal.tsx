"use client";

import dynamic from "next/dynamic";

// Lazy load the UpgradeModal content - only loads when modal is opened
const UpgradeModalContent = dynamic(
  () => import("./UpgradeModalContent").then((mod) => ({ default: mod.UpgradeModal })),
  { ssr: false }
);

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

export function UpgradeModal({ open, onOpenChange, feature }: UpgradeModalProps) {
  // Only render the modal content when open to avoid loading the code eagerly
  if (!open) return null;

  return (
    <UpgradeModalContent
      open={open}
      onOpenChange={onOpenChange}
      feature={feature}
    />
  );
}
