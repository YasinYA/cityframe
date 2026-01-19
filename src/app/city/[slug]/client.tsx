"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapView } from "@/components/map/MapView";
import { StylePicker } from "@/components/styles/StylePicker";
import { DevicePicker } from "@/components/devices/DevicePicker";
import { GenerateButton } from "@/components/generation/GenerateButton";
import { ShareButtons } from "@/components/sharing/ShareButtons";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { City } from "@/lib/cities";
import { MapStyle } from "@/types";
import {
  Palette,
  Sparkles,
  MapPin,
  Users,
  Clock,
  User,
  LogOut,
} from "lucide-react";
import Image from "next/image";
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

  // Set initial location and city name
  useEffect(() => {
    setLocation({
      lat: city.lat,
      lng: city.lng,
      zoom: 13,
      bearing: 0,
      pitch: 0,
    });
    setCityName(city.name);
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
    <main className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md px-6 md:px-10">
        <div className="flex h-14 items-center justify-between">
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
              url={`https://cityframe.app/city/${city.slug}`}
              title={`${city.name} Wallpapers`}
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

      {/* City Hero */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background px-6 md:px-10">
        <div className="py-8">
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
      <section className="border-t bg-muted/30 px-6 md:px-10">
        <div className="py-12">
          <h2 className="text-2xl font-bold mb-4">
            About {city.name} Wallpapers
          </h2>
          <p className="text-muted-foreground max-w-3xl">
            Create beautiful, high-resolution wallpapers featuring the unique
            street layout and geography of {city.name}, {city.country}.
            Whether you&apos;re a local resident or just love the city,
            City Frame lets you generate custom wallpapers that showcase{" "}
            {city.name}&apos;s distinctive character.
          </p>
        </div>
      </section>
    </main>
  );
}
