"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

const PRO_FEATURES = [
  "All 6 premium map styles",
  "All device sizes (Desktop, Tablet, Ultra-wide)",
  "No watermarks on wallpapers",
  "Priority generation queue",
  "Unlimited generations",
];

export function UpgradeModal({ open, onOpenChange, feature }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-center text-xl">
            Unlock {feature || "Pro Features"}
          </DialogTitle>
          <DialogDescription className="text-center">
            Upgrade to Pro for unlimited access to all styles, devices, and features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {PRO_FEATURES.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Link href="/pricing" onClick={() => onOpenChange(false)}>
            <Button className="w-full gap-2" size="lg">
              <Zap className="w-4 h-4" />
              View Pricing
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
