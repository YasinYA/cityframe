"use client";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Grid3X3, RotateCcw, Type } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapControlsProps {
  zoom: number;
  bearing: number;
  pitch: number;
  showGrid: boolean;
  showLabels: boolean;
  onZoomChange: (zoom: number) => void;
  onBearingChange: (bearing: number) => void;
  onPitchChange: (pitch: number) => void;
  onGridToggle: () => void;
  onLabelsToggle: () => void;
}

export function MapControls({
  zoom,
  bearing,
  pitch,
  showGrid,
  showLabels,
  onZoomChange,
  onBearingChange,
  onPitchChange,
  onGridToggle,
  onLabelsToggle,
}: MapControlsProps) {
  const handleReset = () => {
    onBearingChange(0);
    onPitchChange(0);
  };

  return (
    <div className="bg-background/95 backdrop-blur-md border rounded-xl shadow-lg p-4 space-y-4 w-48">
      {/* Zoom */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground font-medium">Zoom</span>
          <span className="font-mono text-foreground">{zoom.toFixed(1)}</span>
        </div>
        <Slider
          value={[zoom]}
          min={1}
          max={20}
          step={0.1}
          onValueChange={([value]) => onZoomChange(value)}
        />
      </div>

      {/* Bearing (Rotation) */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground font-medium">Rotation</span>
          <span className="font-mono text-foreground">{bearing.toFixed(0)}°</span>
        </div>
        <Slider
          value={[bearing]}
          min={0}
          max={360}
          step={1}
          onValueChange={([value]) => onBearingChange(value)}
        />
      </div>

      {/* Pitch (Tilt) */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground font-medium">Tilt</span>
          <span className="font-mono text-foreground">{pitch.toFixed(0)}°</span>
        </div>
        <Slider
          value={[pitch]}
          min={0}
          max={85}
          step={1}
          onValueChange={([value]) => onPitchChange(value)}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex gap-2">
          <Button
            variant={showLabels ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={onLabelsToggle}
          >
            <Type className="w-4 h-4" />
            Labels
          </Button>
          <Button
            variant={showGrid ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={onGridToggle}
          >
            <Grid3X3 className="w-4 h-4" />
            Grid
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleReset}
        >
          <RotateCcw className="w-4 h-4" />
          Reset View
        </Button>
      </div>
    </div>
  );
}
