"use client";

import { useAppStore } from "@/lib/store";
import { DEVICE_PRESETS } from "@/lib/map/styles";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Lock,
  Rocket,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SignInModal } from "@/components/auth/SignInModal";

// Prelaunch mode shows "Join the Launch List" instead of generate
const IS_PRELAUNCH = process.env.NEXT_PUBLIC_PRELAUNCH === "true";

export function GenerateButton() {
  const router = useRouter();
  const {
    jobStatus,
    jobProgress,
    generatedImages,
    error,
    startGeneration,
    reset,
    selectedStyle,
    selectedDevices,
    mapInstance,
  } = useAppStore();

  const { authenticated, isLoading: authLoading } = useAuth();
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Prelaunch mode - show "Join the Launch List" button
  if (IS_PRELAUNCH) {
    return (
      <Button
        className="w-full gap-2 h-12 rounded-xl font-semibold shadow-lg shadow-primary/20"
        onClick={() => router.push("/#get-started")}
      >
        <Rocket className="w-4 h-4" />
        Join the Launch List
      </Button>
    );
  }

  const handleDownload = (url: string, device: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `cityframe-${selectedStyle}-${device}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    generatedImages.forEach((img) => {
      setTimeout(() => handleDownload(img.url, img.device), 100);
    });
  };

  const handleGenerate = () => {
    startGeneration();
  };

  // Show download dialog when complete
  if (jobStatus === "completed" && generatedImages.length > 0) {
    return (
      <>
        <Button
          className="w-full gap-2 h-12 rounded-xl font-semibold shadow-lg shadow-primary/20"
          onClick={() => setShowDownloadDialog(true)}
        >
          <Download className="w-4 h-4" />
          Download Wallpaper{generatedImages.length > 1 ? "s" : ""}
        </Button>

        <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="mx-auto w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7 text-green-500" />
              </div>
              <DialogTitle className="text-center">
                Wallpapers Ready!
              </DialogTitle>
              <DialogDescription className="text-center">
                Your wallpapers have been generated. Download them below.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Preview Card */}
              {generatedImages.length > 0 && (
                <div className="flex justify-center gap-3 p-5 bg-muted/30 rounded-2xl border">
                  {generatedImages.map((img) => {
                    const preset =
                      DEVICE_PRESETS[img.device as keyof typeof DEVICE_PRESETS];
                    const isPortrait = preset ? preset.height > preset.width : true;
                    return (
                      <div
                        key={`preview-${img.device}`}
                        className={cn(
                          "rounded-xl overflow-hidden shadow-xl bg-black ring-2 ring-white/10",
                          isPortrait ? "h-48 w-auto" : "w-48 h-auto"
                        )}
                      >
                        <img
                          src={img.url}
                          alt={`${preset?.name || img.device} preview`}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {generatedImages.length > 1 && (
                <Button
                  className="w-full gap-2 h-12 rounded-xl font-semibold shadow-lg shadow-primary/20"
                  size="lg"
                  onClick={handleDownloadAll}
                >
                  <Download className="w-5 h-5" />
                  Download All ({generatedImages.length})
                </Button>
              )}

              <div className="space-y-2">
                {generatedImages.map((img) => {
                  const preset =
                    DEVICE_PRESETS[img.device as keyof typeof DEVICE_PRESETS];
                  return (
                    <button
                      key={img.device}
                      onClick={() => handleDownload(img.url, img.device)}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 border hover:bg-muted/50 hover:border-primary/20 transition-all"
                    >
                      <div className="text-left">
                        <div className="font-semibold text-sm">
                          {preset?.name || img.device}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {preset?.width} × {preset?.height}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Download className="w-4 h-4 text-primary" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl font-semibold hover:bg-primary/5 hover:border-primary/30 hover:text-foreground transition-all"
                onClick={() => {
                  reset();
                  setShowDownloadDialog(false);
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Another
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-muted-foreground rounded-xl hover:bg-primary/5 hover:text-foreground transition-all"
          onClick={reset}
        >
          Generate Another
        </Button>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-destructive/10 border-2 border-destructive/20 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <div className="font-semibold text-sm text-destructive">
              Generation Failed
            </div>
            <div className="text-xs text-destructive/80 mt-1">{error}</div>
          </div>
        </div>
        <Button variant="outline" className="w-full h-11 rounded-xl font-semibold hover:bg-primary/5 hover:border-primary/30 hover:text-foreground transition-all" onClick={reset}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // Loading state
  if (jobStatus === "pending" || jobStatus === "processing") {
    return (
      <div className="space-y-4">
        <div className="relative">
          <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${Math.max(jobProgress, 5)}%` }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-3 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>
            {jobStatus === "pending"
              ? "Starting generation..."
              : `Generating wallpaper${selectedDevices.length > 1 ? "s" : ""}... ${jobProgress}%`}
          </span>
        </div>
      </div>
    );
  }

  // Map not ready state
  if (!mapInstance) {
    return (
      <Button className="w-full gap-2 h-12 rounded-xl font-semibold" disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading map...
      </Button>
    );
  }

  // Auth loading state
  if (authLoading) {
    return (
      <Button className="w-full gap-2 h-12 rounded-xl font-semibold" disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  // Not authenticated - show sign in prompt
  if (!authenticated) {
    return (
      <>
        <Button
          className="w-full gap-2 h-12 rounded-xl font-semibold shadow-lg shadow-primary/20"
          variant="default"
          onClick={() => setShowAuthModal(true)}
        >
          <Lock className="w-4 h-4" />
          Sign in to Generate
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-3 font-medium">
          Free preview. Sign in to download wallpapers.
        </p>
        <SignInModal
          open={showAuthModal}
          onOpenChange={setShowAuthModal}
        />
      </>
    );
  }

  // Default state - authenticated
  return (
    <Button className="w-full gap-2 h-12 rounded-xl font-semibold shadow-lg shadow-primary/20" onClick={handleGenerate}>
      <Sparkles className="w-4 h-4" />
      Generate Wallpaper
    </Button>
  );
}
