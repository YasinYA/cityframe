"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useSubscription } from "@/hooks/useSubscription";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, Zap, Lock, ChevronDown, ChevronUp, Info } from "lucide-react";
import { UpgradeModal } from "@/components/pricing/UpgradeModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AISettings() {
  const { aiOptions, setAIOptions, toggleAI } = useAppStore();
  const { isPro } = useSubscription();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleToggleAI = () => {
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }
    toggleAI();
  };

  return (
    <>
      <Card className={cn(
        "p-2 transition-all",
        aiOptions.enabled && isPro ? "border-purple-500/50 bg-purple-500/5" : ""
      )}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              aiOptions.enabled && isPro
                ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                : "bg-secondary text-muted-foreground"
            )}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">AI Enhancement</span>
                {!isPro && (
                  <span className="px-1 py-0.5 text-[8px] font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center gap-0.5">
                    <Lock className="w-2 h-2" />
                    PRO
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Upscale & enhance with AI
              </p>
            </div>
          </div>

          <Button
            variant={aiOptions.enabled && isPro ? "default" : "outline"}
            size="sm"
            onClick={handleToggleAI}
            className={cn(
              "h-7 text-xs",
              aiOptions.enabled && isPro && "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            )}
          >
            {aiOptions.enabled && isPro ? (
              <>
                <Zap className="w-3 h-3 mr-1" />
                On
              </>
            ) : (
              "Enable"
            )}
          </Button>
        </div>

        {/* Expandable Options */}
        {aiOptions.enabled && isPro && (
          <>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-center gap-1 mt-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Hide
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  Options
                </>
              )}
            </button>

            {isExpanded && (
              <div className="mt-2 space-y-2 pt-2 border-t">
                {/* Upscale Option */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium">Upscale</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-[200px]">
                            Use AI to increase image resolution
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant={aiOptions.upscale && aiOptions.upscaleFactor === 2 ? "default" : "outline"}
                      size="sm"
                      className="text-[10px] h-6 px-2"
                      onClick={() => setAIOptions({ upscale: true, upscaleFactor: 2 })}
                    >
                      2x
                    </Button>
                    <Button
                      variant={aiOptions.upscale && aiOptions.upscaleFactor === 4 ? "default" : "outline"}
                      size="sm"
                      className="text-[10px] h-6 px-2"
                      onClick={() => setAIOptions({ upscale: true, upscaleFactor: 4 })}
                    >
                      4x
                    </Button>
                    <Button
                      variant={!aiOptions.upscale ? "default" : "outline"}
                      size="sm"
                      className="text-[10px] h-6 px-2"
                      onClick={() => setAIOptions({ upscale: false })}
                    >
                      Off
                    </Button>
                  </div>
                </div>

                {/* Style Enhancement Option */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium">Style Enhance</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-[200px]">
                            Apply AI style enhancement
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Button
                    variant={aiOptions.enhanceStyle ? "default" : "outline"}
                    size="sm"
                    className="text-[10px] h-6"
                    onClick={() => setAIOptions({ enhanceStyle: !aiOptions.enhanceStyle })}
                  >
                    {aiOptions.enhanceStyle ? "On" : "Off"}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        feature="AI enhancement"
      />
    </>
  );
}
