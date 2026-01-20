"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Rocket,
} from "lucide-react";

// Prelaunch mode
const IS_PRELAUNCH = process.env.NEXT_PUBLIC_PRELAUNCH === "true";
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
import { motion } from "framer-motion";

// Animation variants matching PreLaunchPage
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

interface CityPageClientProps {
  city: City;
  styles: MapStyle[];
}

export function CityPageClient({ city, styles }: CityPageClientProps) {
  const router = useRouter();
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
      <header className="shrink-0 z-50 border-b bg-background/80 backdrop-blur-md px-4 md:px-6">
        <div className="flex h-[60px] md:h-[70px] items-center justify-between max-w-[1800px] mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.webp"
              alt="City Frame"
              width={32}
              height={32}
              className="w-8 h-8 md:w-9 md:h-9"
            />
            <span className="font-extrabold text-lg md:text-xl tracking-tight hidden sm:block">City Frame</span>
          </Link>

          <div className="flex items-center gap-3">
            {!IS_PRELAUNCH && !isLoading && (
              authenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 rounded-xl hover:bg-primary/5 hover:text-foreground">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
                        {user?.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl border-2 shadow-lg">
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSignInOpen(true)}
                  className="rounded-xl font-semibold hover:bg-primary/5 hover:border-primary/30 hover:text-foreground transition-all"
                >
                  Sign In
                </Button>
              )
            )}
          </div>
        </div>
      </header>

      <SignInModal open={signInOpen} onOpenChange={setSignInOpen} />

      {/* City Hero */}
      <section className="shrink-0 border-b bg-background px-4 md:px-6 relative overflow-hidden">

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="py-6 md:py-10 relative max-w-[1800px] mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm font-semibold">{getCityDisplayName(city)}</span>
                <span className="text-sm">·</span>
                <span className="text-sm">{city.country}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                {city.name} <span className="text-primary">Wallpapers</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base mt-2 hidden md:block max-w-xl leading-relaxed">
                {city.description}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-4">
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{formatPopulation(city.population)}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{city.timezone.split("/").pop()}</span>
                </div>
              </div>
              <ShareButtons
                url={`https://cityframe.app/city/${city.slug}`}
                title={`${city.name} Wallpapers`}
              />
            </motion.div>
          </div>
        </motion.div>
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
            "fixed md:static right-0 top-[60px] md:top-auto bottom-0 md:bottom-auto w-80 md:w-72 lg:w-80 md:h-full bg-background/95 backdrop-blur-md border-l z-50 md:z-auto",
            "transform transition-transform duration-300 ease-in-out",
            "md:transform-none",
            sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
          )}
        >
          <div className="h-full flex flex-col overflow-hidden">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Style Section */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Palette className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-sm font-bold">Style</h2>
                </div>
                <StylePicker />
              </motion.section>

              {/* Device Section */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-sm font-bold">Devices</h2>
                </div>
                <DevicePicker />
              </motion.section>
            </div>

            {/* Fixed Bottom */}
            <div className="shrink-0 p-4 border-t bg-background/95 backdrop-blur-md">
              <GenerateButton />
            </div>
          </div>
        </aside>

        {/* Mobile Bottom Bar (when sidebar is closed) */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-30">
          {!sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-3 shadow-2xl shadow-primary/10 border-2 rounded-2xl bg-background/95 backdrop-blur-md">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-xl font-semibold hover:bg-primary/5 hover:border-primary/30 hover:text-foreground transition-all"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                  {IS_PRELAUNCH ? (
                    <Button
                      className="flex-1 h-12 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                      onClick={() => router.push("/#get-started")}
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Join Launch List
                    </Button>
                  ) : (
                    <Button
                      className="flex-1 h-12 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                      onClick={() => setSidebarOpen(true)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
