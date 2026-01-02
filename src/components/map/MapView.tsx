"use client";

import dynamic from "next/dynamic";

const MapViewClient = dynamic(() => import("./MapViewClient"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-muted flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Loading map...</span>
        </div>
      </div>
    </div>
  ),
});

export function MapView() {
  return <MapViewClient />;
}
