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
import { City, getCityDisplayName } from "@/lib/cities";
import { STYLE_GRADIENTS, STYLE_ICONS } from "@/lib/map/styles";
import { MapStyle } from "@/types";
import { MapPin, Smartphone, Check, User, LogOut, Palette, Download } from "lucide-react";
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
  const { setLocation, setSelectedStyle, setCityName } = useAppStore();
  const { authenticated, isLoading, user, signOut } = useAuth();
  const [signInOpen, setSignInOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    setCityName(city.name, city.shortName);
  }, [city, style, setLocation, setSelectedStyle, setCityName]);

  const gradient = STYLE_GRADIENTS[style.id] || "from-gray-200 to-gray-300";
  const icon = STYLE_ICONS[style.id] || "◉";

  return (
    <main className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.webp"
              alt="City Frame"
              width={32}
              height={32}
            />
            <span className="font-semibold hidden sm:block">City Frame</span>
          </Link>

          <div className="flex items-center gap-3">
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
      <section className="shrink-0 border-b bg-gradient-to-b from-muted/50 to-background px-4 md:px-6">
        <div className="py-12">
          <div className="flex items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              {/* Style Preview */}
              <div
                className={cn(
                  "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center bg-gradient-to-br shrink-0",
                  gradient
                )}
              >
                <span
                  className={cn(
                    "text-2xl md:text-3xl",
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
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="w-4 h-4" />
                  <Link
                    href={`/city/${city.slug}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {getCityDisplayName(city)}
                  </Link>
                  <span className="text-sm">·</span>
                  <span className="text-sm">{city.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {style.name}
                  </h1>
                  {style.isPro && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                      PRO
                    </span>
                  )}
                </div>
              </div>
            </div>

            <ShareButtons
              url={`https://cityframe.app/city/${city.slug}/${style.id}`}
              title={`${city.name} ${style.name} Wallpaper`}
              description={`Create a stunning ${style.name} wallpaper of ${city.name}`}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row relative min-h-0">
        {/* Map Area */}
        <div className="flex-1 relative min-h-[40vh] md:min-h-0">
          <MapView />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed md:static right-0 top-14 bottom-0 md:top-auto md:bottom-auto w-72 md:h-full bg-card border-l z-50 md:z-auto",
            "transform transition-transform duration-300 ease-in-out",
            "md:transform-none",
            sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
          )}
        >
          <div className="h-full flex flex-col overflow-hidden">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-6">
              {/* Selected Style Confirmation */}
              <Card className="p-3 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br",
                      gradient
                    )}
                  >
                    <span
                      className={cn(
                        "text-lg",
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
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{style.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      Selected style
                    </div>
                  </div>
                  <Check className="w-4 h-4 text-primary shrink-0" />
                </div>
              </Card>

              {/* Other Styles */}
              <section className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">Other Styles</h2>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-3 px-3 scrollbar-hide">
                  {allStyles
                    .filter((s) => s.id !== style.id)
                    .map((s) => {
                      const g = STYLE_GRADIENTS[s.id] || "from-gray-200 to-gray-300";
                      const i = STYLE_ICONS[s.id] || "◉";

                      return (
                        <Link key={s.id} href={`/city/${city.slug}/${s.id}`}>
                          <div className="flex-shrink-0 w-14 p-1 rounded-lg border hover:border-muted-foreground/30 transition-colors cursor-pointer">
                            <div
                              className={cn(
                                "aspect-square rounded-md mb-1 flex items-center justify-center bg-gradient-to-br",
                                g
                              )}
                            >
                              <span
                                className={cn(
                                  "text-sm",
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
                            <div className="text-[8px] font-medium truncate text-center">
                              {s.name}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </section>

              {/* Device Section */}
              <section className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">Devices</h2>
                </div>
                <DevicePicker />
              </section>
            </div>

            {/* Fixed Bottom */}
            <div className="shrink-0 p-3 border-t bg-card">
              <GenerateButton />
            </div>
          </div>
        </aside>

        {/* Mobile Bottom Bar (when sidebar is closed) */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-30">
          {!sidebarOpen && (
            <Card className="p-3 shadow-lg">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Customize
                </Button>
                <Button className="flex-1" onClick={() => setSidebarOpen(true)}>
                  <Download className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
