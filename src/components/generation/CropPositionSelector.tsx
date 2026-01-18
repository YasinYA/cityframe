"use client";

import { useAppStore } from "@/lib/store";
import { CropPosition } from "@/types";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export function CropPositionSelector() {
  const { cropPosition, setCropPosition, selectedDevices } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Position as percentage (0-100 for both x and y)
  const getInitialPosition = () => {
    const positions: Record<CropPosition, { x: number; y: number }> = {
      "top-left": { x: 0, y: 0 },
      "top": { x: 50, y: 0 },
      "top-right": { x: 100, y: 0 },
      "left": { x: 0, y: 50 },
      "center": { x: 50, y: 50 },
      "right": { x: 100, y: 50 },
      "bottom-left": { x: 0, y: 100 },
      "bottom": { x: 50, y: 100 },
      "bottom-right": { x: 100, y: 100 },
    };
    return positions[cropPosition] || { x: 50, y: 50 };
  };

  const [position, setPosition] = useState(getInitialPosition);

  // Sync position when cropPosition changes externally
  useEffect(() => {
    setPosition(getInitialPosition());
  }, [cropPosition]);

  // Only show if phone devices are selected (not tablet/desktop)
  const hasPhoneDevice = selectedDevices.some((d) =>
    ["iphone", "android"].includes(d)
  );

  const snapToPosition = (x: number, y: number): CropPosition => {
    // Determine horizontal position
    let hPos: "left" | "" | "right" = "";
    if (x < 33) hPos = "left";
    else if (x > 67) hPos = "right";

    // Determine vertical position
    let vPos: "top" | "center" | "bottom" = "center";
    if (y < 33) vPos = "top";
    else if (y > 67) vPos = "bottom";

    // Combine to get CropPosition
    if (vPos === "center" && hPos === "") return "center";
    if (vPos === "center") return hPos as CropPosition;
    if (hPos === "") return vPos as CropPosition;
    return `${vPos}-${hPos}` as CropPosition;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updatePosition(e);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      const newCropPosition = snapToPosition(position.x, position.y);
      setCropPosition(newCropPosition);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      const newCropPosition = snapToPosition(position.x, position.y);
      setCropPosition(newCropPosition);
    }
  };

  const updatePosition = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  if (!hasPhoneDevice) return null;

  // Frame dimensions - portrait aspect ratio (9:19.5 like iPhone)
  const frameWidthPercent = 30;
  const frameHeightPercent = 95;

  // Calculate frame position (frame center follows cursor)
  const frameLeft = Math.max(0, Math.min(100 - frameWidthPercent, position.x - frameWidthPercent / 2));
  const frameTop = Math.max(0, Math.min(100 - frameHeightPercent, position.y - frameHeightPercent / 2));

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        Focus Area
      </label>

      {/* Visual crop selector */}
      <div
        ref={containerRef}
        className={cn(
          "relative w-full h-28 bg-gradient-to-br from-secondary/30 to-secondary/60 rounded-lg border cursor-move overflow-hidden select-none",
          isDragging ? "border-primary" : "border-muted-foreground/20"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Grid overlay for visual reference */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/3 left-0 right-0 border-t border-muted-foreground" />
          <div className="absolute top-2/3 left-0 right-0 border-t border-muted-foreground" />
          <div className="absolute left-1/3 top-0 bottom-0 border-l border-muted-foreground" />
          <div className="absolute left-2/3 top-0 bottom-0 border-l border-muted-foreground" />
        </div>

        {/* Portrait frame overlay */}
        <div
          className={cn(
            "absolute border-2 rounded-md transition-colors",
            isDragging
              ? "border-primary bg-primary/15 shadow-lg"
              : "border-primary/60 bg-primary/10"
          )}
          style={{
            width: `${frameWidthPercent}%`,
            height: `${frameHeightPercent}%`,
            left: `${frameLeft}%`,
            top: `${frameTop}%`,
          }}
        >
          {/* Phone notch indicator */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-primary/30" />
        </div>

        {/* Corner labels */}
        <div className="absolute top-1 left-1.5 text-[8px] text-muted-foreground/40 font-medium">TL</div>
        <div className="absolute top-1 right-1.5 text-[8px] text-muted-foreground/40 font-medium">TR</div>
        <div className="absolute bottom-1 left-1.5 text-[8px] text-muted-foreground/40 font-medium">BL</div>
        <div className="absolute bottom-1 right-1.5 text-[8px] text-muted-foreground/40 font-medium">BR</div>
      </div>

      <p className="text-[10px] text-muted-foreground">
        Drag to position the crop area for portrait wallpapers
      </p>
    </div>
  );
}
