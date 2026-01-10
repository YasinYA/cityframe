"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MapView } from "@/components/map/MapView";
import { StylePicker } from "@/components/styles/StylePicker";
import { DevicePicker } from "@/components/devices/DevicePicker";
import { GenerateButton } from "@/components/generation/GenerateButton";
import { ShareButtons } from "@/components/sharing/ShareButtons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { City } from "@/lib/cities";
import { STYLE_GRADIENTS, STYLE_ICONS } from "@/lib/map/styles";
import { MapStyle } from "@/types";
import {
  Palette,
  Sparkles,
  ArrowLeft,
  MapPin,
  Users,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CityPageClientProps {
  city: City;
  styles: MapStyle[];
}

export function CityPageClient({ city, styles }: CityPageClientProps) {
  const { setLocation, selectedStyle, setSelectedStyle } = useAppStore();

  // Set initial location to city coordinates
  useEffect(() => {
    setLocation({
      lat: city.lat,
      lng: city.lng,
      zoom: 13,
      bearing: 0,
      pitch: 0,
    });
  }, [city, setLocation]);

  const formatPopulation = (pop: number) => {
    if (pop >= 1000000) {
      return `${(pop / 1000000).toFixed(1)}M`;
    }
    if (pop >= 1000) {
      return `${(pop / 1000).toFixed(0)}K`;
    }
    return pop.toString();
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Image
              src="/logo.webp"
              alt="City Frame"
              width={48}
              height={48}
              className="rounded-lg"
            />
          </div>

          <ShareButtons
            url={`https://cityframe.app/city/${city.slug}`}
            title={`${city.name} Wallpapers`}
          />
        </div>
      </header>

      {/* City Hero */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{city.country}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {city.name} Wallpapers
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                {city.description}. Create stunning wallpapers from {city.name}
                &apos;s unique street layout and landmarks.
              </p>
            </div>

            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{formatPopulation(city.population)} people</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{city.timezone.split("/").pop()}</span>
              </div>
            </div>
          </div>

          {/* Quick Style Selection */}
          <div className="mt-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Quick Styles
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {styles.map((style) => {
                const isSelected = selectedStyle === style.id;
                const gradient =
                  STYLE_GRADIENTS[style.id] || "from-gray-200 to-gray-300";
                const icon = STYLE_ICONS[style.id] || "◉";

                return (
                  <Link
                    key={style.id}
                    href={`/city/${city.slug}/${style.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedStyle(style.id);
                    }}
                  >
                    <Card
                      className={cn(
                        "flex-shrink-0 w-24 p-2 cursor-pointer transition-all",
                        isSelected
                          ? "ring-2 ring-primary"
                          : "hover:ring-1 hover:ring-muted-foreground/20"
                      )}
                    >
                      <div
                        className={cn(
                          "aspect-square rounded-md mb-1 flex items-center justify-center bg-gradient-to-br",
                          gradient
                        )}
                      >
                        <span
                          className={cn(
                            "text-xl",
                            style.id === "dark-mode" ||
                              style.id === "neon-cyber" ||
                              style.id === "satellite"
                              ? "text-white/80"
                              : "text-gray-600/80"
                          )}
                        >
                          {icon}
                        </span>
                      </div>
                      <div className="text-xs font-medium truncate text-center">
                        {style.name}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Map Area */}
        <div className="flex-1 relative min-h-[50vh] lg:min-h-0">
          <MapView />
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l bg-card">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Style Section */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <h2 className="font-semibold">Style</h2>
                </div>
                <StylePicker />
              </section>

              {/* Device Section */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                  <h2 className="font-semibold">Devices</h2>
                </div>
                <DevicePicker />
              </section>
            </div>

            {/* Generate Button */}
            <div className="p-4 border-t bg-card">
              <GenerateButton />
            </div>
          </div>
        </aside>
      </div>

      {/* SEO Content */}
      <section className="border-t bg-muted/30">
        <div className="container px-4 py-12">
          <h2 className="text-2xl font-bold mb-4">
            About {city.name} Wallpapers
          </h2>
          <div className="prose prose-gray max-w-none">
            <p>
              Create beautiful, high-resolution wallpapers featuring the unique
              street layout and geography of {city.name}, {city.country}.
              Whether you&apos;re a local resident or just love the city,
              City Frame lets you generate custom wallpapers that showcase{" "}
              {city.name}&apos;s distinctive character.
            </p>
            <h3>Available Styles</h3>
            <ul>
              {styles.map((style) => (
                <li key={style.id}>
                  <strong>{style.name}</strong>: {style.description}
                </li>
              ))}
            </ul>
            <h3>Device Compatibility</h3>
            <p>
              Our wallpapers are available in multiple resolutions to fit any
              device perfectly:
            </p>
            <ul>
              <li>iPhone (1170×2532) - Perfect for iPhone 12, 13, 14 Pro</li>
              <li>Android (1440×3200) - Fits most Android flagships</li>
              <li>Tablet (2048×2732) - Optimized for iPad Pro</li>
              <li>Desktop (3840×2160) - 4K resolution for monitors</li>
              <li>Ultra-wide (5120×1440) - For 32:9 ultra-wide displays</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
