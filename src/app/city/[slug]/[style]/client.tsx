"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapView } from "@/components/map/MapView";
import { DevicePicker } from "@/components/devices/DevicePicker";
import { GenerateButton } from "@/components/generation/GenerateButton";
import { ShareButtons } from "@/components/sharing/ShareButtons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { City } from "@/lib/cities";
import { STYLE_GRADIENTS, STYLE_ICONS } from "@/lib/map/styles";
import { MapStyle } from "@/types";
import { MapPin, Sparkles, Check, User, LogOut } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SignInModal } from "@/components/auth/SignInModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CityStylePageClientProps {
  city: City;
  style: MapStyle;
  allStyles: MapStyle[];
}

export function CityStylePageClient({
  city,
  style,
  allStyles,
}: CityStylePageClientProps) {
  const { setLocation, setSelectedStyle, selectedStyle, setCityName } = useAppStore();
  const { authenticated, isLoading, user, signOut } = useAuth();
  const [signInOpen, setSignInOpen] = useState(false);

  // Set initial location, style, and city name
  useEffect(() => {
    setLocation({
      lat: city.lat,
      lng: city.lng,
      zoom: 13,
      bearing: 0,
      pitch: 0,
    });
    setSelectedStyle(style.id);
    setCityName(city.name);
  }, [city, style, setLocation, setSelectedStyle, setCityName]);

  const gradient = STYLE_GRADIENTS[style.id] || "from-gray-200 to-gray-300";
  const icon = STYLE_ICONS[style.id] || "◉";

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between px-4 max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.webp"
              alt="City Frame"
              width={32}
              height={32}
            />
            <span className="font-semibold">City Frame</span>
          </Link>

          <div className="flex items-center gap-3">
            <ShareButtons
              url={`https://cityframe.app/city/${city.slug}/${style.id}`}
              title={`${city.name} ${style.name} Wallpaper`}
              description={`Create a stunning ${style.name} wallpaper of ${city.name}`}
            />

            {!isLoading && (
              authenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="hidden sm:inline text-sm max-w-[120px] truncate">
                        {user?.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                      {user?.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setSignInOpen(true)}>
                  Sign In
                </Button>
              )
            )}
          </div>
        </div>
      </header>

      <SignInModal open={signInOpen} onOpenChange={setSignInOpen} />

      {/* Style Hero */}
      <section className="border-b">
        <div className="container px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Style Preview */}
            <div
              className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br shrink-0",
                gradient
              )}
            >
              <span
                className={cn(
                  "text-3xl",
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

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <Link
                  href={`/city/${city.slug}`}
                  className="text-sm hover:underline"
                >
                  {city.name}, {city.country}
                </Link>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {style.name} Style
              </h1>
              <p className="text-muted-foreground">{style.description}</p>
            </div>

            {/* Pro Badge */}
            {style.isPro && (
              <div className="shrink-0">
                <span className="px-3 py-1.5 text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                  PRO
                </span>
              </div>
            )}
          </div>

          {/* Other Styles */}
          <div className="mt-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Other Styles
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allStyles
                .filter((s) => s.id !== style.id)
                .map((s) => {
                  const g = STYLE_GRADIENTS[s.id] || "from-gray-200 to-gray-300";
                  const i = STYLE_ICONS[s.id] || "◉";

                  return (
                    <Link key={s.id} href={`/city/${city.slug}/${s.id}`}>
                      <Card className="flex-shrink-0 w-20 p-2 cursor-pointer transition-all hover:ring-1 hover:ring-muted-foreground/20">
                        <div
                          className={cn(
                            "aspect-square rounded-md mb-1 flex items-center justify-center bg-gradient-to-br",
                            g
                          )}
                        >
                          <span
                            className={cn(
                              "text-lg",
                              s.id === "dark-mode" ||
                                s.id === "neon-cyber" ||
                                s.id === "satellite"
                                ? "text-white/80"
                                : "text-gray-600/80"
                            )}
                          >
                            {i}
                          </span>
                        </div>
                        <div className="text-[10px] font-medium truncate text-center">
                          {s.name}
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
              {/* Selected Style Confirmation */}
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
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
                  <div className="flex-1">
                    <div className="font-medium">{style.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Selected style
                    </div>
                  </div>
                  <Check className="w-5 h-5 text-primary" />
                </div>
              </Card>

              {/* Device Section */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                  <h2 className="font-semibold">Select Devices</h2>
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
    </main>
  );
}
