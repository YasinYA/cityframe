"use client";

import { useState, useRef, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, X } from "lucide-react";
import { STYLE_CONFIGS } from "@/lib/map/styles";
import { searchCities, getCityOgStyle, getCityBySlug, type City } from "@/lib/cities";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, stagger } from "./animations";

// Hand-picked popular cities for the landing page
const FEATURED_CITY_SLUGS = [
  "new-york",
  "paris",
  "tokyo",
  "london",
  "dubai",
  "barcelona",
  "singapore",
  "sydney",
  "rome",
  "los-angeles",
  "amsterdam",
  "hong-kong",
];

// City Search Section Component - memoized to prevent unnecessary re-renders
export const CitySearchSection = memo(function CitySearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const popularCities = FEATURED_CITY_SLUGS.map(slug => getCityBySlug(slug)).filter((city): city is City => city !== undefined);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setSearchResults(searchCities(searchQuery));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  const clearSelection = () => {
    setSelectedCity(null);
  };

  const getCityStyle = (citySlug: string) => {
    const styleId = getCityOgStyle(citySlug) || "midnight-gold";
    const styleConfig = STYLE_CONFIGS.find(s => s.id === styleId);
    return {
      id: styleId,
      name: styleConfig?.name || "Midnight Gold"
    };
  };

  return (
    <section className="py-16 md:py-32 lg:py-48 px-4 md:px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      {/* Map Roads Pattern */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url("/road_layout.svg")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, hsl(var(--background)) 70%)',
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-8 md:mb-12"
        >
          <motion.p
            variants={fadeInUp}
            className="text-primary font-semibold text-base md:text-lg mb-4 md:mb-6 tracking-wide"
          >
            Try it now
          </motion.p>
          <h2 className="text-[32px] sm:text-[40px] md:text-[56px] lg:text-[80px] xl:text-[96px] font-extrabold tracking-tight mb-4 md:mb-8 leading-[1.05]">
            <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Search your city
            </span>
          </h2>
          <p className="text-base md:text-xl lg:text-2xl text-muted-foreground font-medium max-w-xl mx-auto px-2">
            Find the place you love and preview your wallpaper instantly
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative mb-8 md:mb-12"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl md:rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 md:w-6 h-5 md:h-6 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for any city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full h-14 md:h-20 pl-12 md:pl-16 pr-4 md:pr-8 text-base md:text-xl rounded-xl md:rounded-2xl border-2 bg-background shadow-lg focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-3 bg-background border-2 rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                {searchResults.map((city) => (
                  <button
                    key={city.slug}
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-6 py-5 text-left hover:bg-primary/5 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-bold text-lg">{city.name}</span>
                      <span className="text-muted-foreground ml-3">{city.country}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Popular Cities */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mb-10 md:mb-16"
        >
          <p className="text-xs md:text-sm text-muted-foreground text-center mb-4 md:mb-8 font-semibold uppercase tracking-widest">Popular destinations</p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {popularCities.map((city) => (
              <motion.button
                key={city.slug}
                variants={fadeInUp}
                onClick={() => handleCitySelect(city)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 md:px-6 py-2 md:py-3 rounded-full border-2 bg-background hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10 transition-all font-semibold text-sm md:text-base"
              >
                {city.name}
              </motion.button>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-xs md:text-sm mt-6 md:mt-8">
            Don&apos;t see your city? We&apos;re adding more every week!
          </p>
        </motion.div>

        {/* Inline Preview */}
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-br from-background to-muted/50 rounded-2xl md:rounded-3xl p-5 md:p-8 lg:p-12 relative border-2 shadow-2xl">
                {/* Close button */}
                <button
                  onClick={clearSelection}
                  className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background border-2 flex items-center justify-center hover:bg-muted hover:border-primary/30 transition-all"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
                  {/* Left column - Title + Preview Image */}
                  <div className="flex flex-col items-center md:items-start">
                    <div className="mb-4 md:mb-8 text-center md:text-left">
                      <p className="text-primary font-semibold text-xs md:text-sm uppercase tracking-widest mb-1 md:mb-2">Preview</p>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold">{selectedCity.name}</h3>
                      <p className="text-muted-foreground text-base md:text-lg">{selectedCity.country}</p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="aspect-[3/4] w-[200px] md:w-[240px] lg:max-w-[280px] rounded-xl md:rounded-2xl overflow-hidden border-2 shadow-2xl shadow-primary/10 relative group"
                    >
                      <Image
                        src={`/styles/${getCityStyle(selectedCity.slug).id}.png`}
                        alt={`${selectedCity.name} wallpaper preview`}
                        width={280}
                        height={373}
                        className="w-full h-full object-cover"
                      />
                      {/* Style badge */}
                      <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4">
                        <div className="bg-background/90 backdrop-blur-sm rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 border shadow-lg">
                          <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mb-0.5 md:mb-1">Matched style</p>
                          <p className="font-bold text-xs md:text-sm">{getCityStyle(selectedCity.slug).name}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right column - City Info & CTA */}
                  <div className="text-center md:text-left md:pt-16">
                    <p className="text-muted-foreground text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
                      {selectedCity.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <Link href={`/city/${selectedCity.slug}/${getCityStyle(selectedCity.slug).id}`}>
                        <Button size="lg" className="h-14 md:h-16 px-8 md:px-10 rounded-xl text-base md:text-lg w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                          Explore more
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                        </Button>
                      </Link>
                    </div>
                    <p className="text-muted-foreground mt-4 md:mt-6 font-medium text-sm md:text-base">
                      <span className="text-primary font-bold">{STYLE_CONFIGS.length}</span> styles available
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});
