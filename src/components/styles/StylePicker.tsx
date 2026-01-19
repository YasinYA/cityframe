"use client";

import { useState } from "react";
import Image from "next/image";
import { MAP_STYLES } from "@/lib/map/styles";
import { useAppStore } from "@/lib/store";
import { useSubscription } from "@/hooks/useSubscription";
import { isProStyle } from "@/lib/features";
import { cn } from "@/lib/utils";
import { Check, Lock } from "lucide-react";
import { UpgradeModal } from "@/components/pricing/UpgradeModal";

export function StylePicker() {
  const { selectedStyle, setSelectedStyle } = useAppStore();
  const { isPro } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleStyleClick = (styleId: string) => {
    if (isProStyle(styleId) && !isPro) {
      setShowUpgradeModal(true);
      return;
    }
    setSelectedStyle(styleId);
  };

  return (
    <>
      <div className="flex gap-2 overflow-x-auto py-1 -mx-3 px-3 scrollbar-hide">
        {MAP_STYLES.map((style) => {
          const isSelected = selectedStyle === style.id;
          const isLocked = isProStyle(style.id) && !isPro;

          return (
            <button
              key={style.id}
              onClick={() => handleStyleClick(style.id)}
              className={cn(
                "group relative flex-shrink-0 w-[72px] md:w-24 p-1.5 md:p-2 rounded-lg border-2 transition-all duration-200",
                isSelected
                  ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
                  : "border-transparent hover:border-muted-foreground/20 hover:scale-[1.01]",
                isLocked && "opacity-75"
              )}
            >
              {/* Style Preview with Thumbnail */}
              <div className="aspect-[3/4] rounded-md mb-1.5 overflow-hidden bg-secondary relative">
                <Image
                  src={`/styles/${style.id}.png`}
                  alt={style.name}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-200",
                    isSelected ? "scale-110" : "group-hover:scale-105"
                  )}
                  sizes="80px"
                />
              </div>

              {/* Label */}
              <div className="text-[10px] md:text-xs font-medium truncate text-center">{style.name}</div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Check className="w-2 h-2 text-white" />
                </div>
              )}

              {/* Pro badge */}
              {style.isPro && (
                <div className="absolute top-0.5 right-0.5 px-1 py-0.5 text-[7px] font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center gap-0.5">
                  <Lock className="w-1.5 h-1.5" />
                  PRO
                </div>
              )}
            </button>
          );
        })}
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        feature="premium styles"
      />
    </>
  );
}
