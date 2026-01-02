"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Check,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export function ShareButtons({
  url,
  title,
  description = "",
  className,
}: ShareButtonsProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-[#1DA1F2] hover:text-white",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-[#4267B2] hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
      color: "hover:bg-[#0077B5] hover:text-white",
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: "hover:bg-gray-600 hover:text-white",
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        // User cancelled or error
        if ((err as Error).name !== "AbortError") {
          setShowDialog(true);
        }
      }
    } else {
      setShowDialog(true);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={cn("gap-2", className)}
        onClick={handleNativeShare}
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this page</DialogTitle>
            <DialogDescription>
              Share {title} with friends and followers
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Social Share Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-lg border transition-colors",
                    link.color
                  )}
                >
                  <link.icon className="w-5 h-5 mb-1" />
                  <span className="text-xs">{link.name}</span>
                </a>
              ))}
            </div>

            {/* Copy Link */}
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-muted rounded-lg border focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                variant={copied ? "default" : "outline"}
                size="icon"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
