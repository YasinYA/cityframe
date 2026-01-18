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
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function GenerateButton() {
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

  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

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
          className="w-full gap-2"
          onClick={() => setShowDownloadDialog(true)}
        >
          <Download className="w-4 h-4" />
          Download Wallpaper{generatedImages.length > 1 ? "s" : ""}
        </Button>

        <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Wallpapers Ready!
              </DialogTitle>
              <DialogDescription>
                Your wallpapers have been generated. Download them below.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              {generatedImages.length > 1 && (
                <Button
                  className="w-full gap-2"
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
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="text-left">
                        <div className="font-medium text-sm">
                          {preset?.name || img.device}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {preset?.width} × {preset?.height}
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
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
          className="w-full mt-2 text-muted-foreground"
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
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-sm text-destructive">
              Generation Failed
            </div>
            <div className="text-xs text-destructive/80 mt-1">{error}</div>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={reset}>
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
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
              style={{ width: `${Math.max(jobProgress, 5)}%` }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-3 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
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
      <Button className="w-full gap-2" disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading map...
      </Button>
    );
  }

  // Default state
  return (
    <Button className="w-full gap-2" onClick={handleGenerate}>
      <Sparkles className="w-4 h-4" />
      Generate Wallpaper
    </Button>
  );
}
