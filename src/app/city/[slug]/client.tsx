"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapView } from "@/components/map/MapView";
import { StylePicker } from "@/components/styles/StylePicker";
import { DevicePicker } from "@/components/devices/DevicePicker";
import { GenerateButton } from "@/components/generation/GenerateButton";
import { ShareButtons } from "@/components/sharing/ShareButtons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { City, getCityDisplayName } from "@/lib/cities";
import { MapStyle } from "@/types";
import {
  Palette,
  Smartphone,
  MapPin,
  Users,
  Clock,
  User,
  LogOut,
  Download,
} from "lucide-react";
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

interface CityPageClientProps {
  city: City;
  styles: MapStyle[];
}

export function CityPageClient({ city, styles }: CityPageClientProps) {
  const { setLocation, setCityName } = useAppStore();
  const { authenticated, isLoading, user, signOut } = useAuth();
  const [signInOpen, setSignInOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Set initial location and city name
  useEffect(() => {
    setLocation({
      lat: city.lat,
      lng: city.lng,
      zoom: 13,
      bearing: 0,
      pitch: 0,
    });
    setCityName(city.name, city.shortName);
  }, [city, setLocation, setCityName]);

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

      {/* City Hero */}
      <section className="shrink-0 border-b bg-gradient-to-b from-muted/50 to-background px-4 md:px-6">
        <div className="py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{getCityDisplayName(city)}</span>
                <span className="text-sm">·</span>
                <span className="text-sm">{city.country}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {city.name} Wallpapers
              </h1>
              <p className="text-muted-foreground text-sm mt-1 hidden md:block max-w-xl">
                {city.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{formatPopulation(city.population)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{city.timezone.split("/").pop()}</span>
                </div>
              </div>
              <ShareButtons
                url={`https://cityframe.app/city/${city.slug}`}
                title={`${city.name} Wallpapers`}
              />
            </div>
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
              {/* Style Section */}
              <section className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">Style</h2>
                </div>
                <StylePicker />
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
