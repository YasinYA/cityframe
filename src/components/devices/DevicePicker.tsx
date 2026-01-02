"use client";

import { useState } from "react";
import { DEVICE_PRESETS } from "@/lib/map/styles";
import { DeviceType } from "@/types";
import { useAppStore } from "@/lib/store";
import { useSubscription } from "@/hooks/useSubscription";
import { isProDevice } from "@/lib/features";
import { cn } from "@/lib/utils";
import { Check, Lock, Smartphone, Tablet, Monitor } from "lucide-react";
import { UpgradeModal } from "@/components/pricing/UpgradeModal";

const DeviceIcons: Record<DeviceType, React.ReactNode> = {
  iphone: <Smartphone className="w-6 h-6" />,
  android: <Smartphone className="w-6 h-6" />,
  tablet: <Tablet className="w-6 h-6" />,
  "tablet-landscape": <Tablet className="w-6 h-6 rotate-90" />,
  desktop: <Monitor className="w-6 h-6" />,
  ultrawide: <Monitor className="w-7 h-5" />,
};

export function DevicePicker() {
  const { selectedDevices, toggleDevice } = useAppStore();
  const { isPro } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const devices = Object.values(DEVICE_PRESETS);

  const handleDeviceClick = (deviceId: DeviceType) => {
    if (isProDevice(deviceId) && !isPro) {
      setShowUpgradeModal(true);
      return;
    }
    toggleDevice(deviceId);
  };

  return (
    <>
      <div className="flex gap-1.5 overflow-x-auto py-1 -mx-3 px-3 scrollbar-hide">
        {devices.map((device) => {
          const isSelected = selectedDevices.includes(device.id);
          const isLocked = isProDevice(device.id) && !isPro;

          return (
            <button
              key={device.id}
              onClick={() => handleDeviceClick(device.id)}
              className={cn(
                "group relative flex-shrink-0 w-20 p-1.5 rounded-lg border-2 transition-all duration-200",
                isSelected
                  ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
                  : "border-transparent hover:border-muted-foreground/20 hover:scale-[1.01]",
                isLocked && "opacity-75"
              )}
            >
              {/* Preview */}
              <div
                className={cn(
                  "aspect-[3/4] rounded-md mb-1 flex items-center justify-center overflow-hidden",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "transition-transform duration-200",
                    isSelected ? "scale-110" : "group-hover:scale-105"
                  )}
                >
                  {DeviceIcons[device.id]}
                </span>
              </div>

              {/* Label */}
              <div className="text-[9px] font-medium truncate text-center">{device.name}</div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Check className="w-2 h-2 text-white" />
                </div>
              )}

              {/* Pro badge */}
              {isLocked && (
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
        feature="all device sizes"
      />
    </>
  );
}
