"use client";

import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { CITIES } from "@/lib/cities";

// Using Nominatim (OpenStreetMap) - free geocoding, no API key required!
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface SearchResult {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
}

interface CitySearchProps {
  onSelect: (lat: number, lng: number) => void;
}

export function CitySearch({ onSelect }: CitySearchProps) {
  const { setCityName } = useAppStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        // Using Nominatim (OpenStreetMap) - free, no API key required!
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5&addressdetails=1`,
          {
            headers: {
              "User-Agent": "CityFrame/1.0 (cityframe.app)",
            },
          }
        );
        const data: NominatimResult[] = await response.json();

        // Convert Nominatim results to our format
        const formattedResults: SearchResult[] = data.map((item) => ({
          id: String(item.place_id),
          place_name: item.display_name,
          center: [parseFloat(item.lon), parseFloat(item.lat)],
        }));

        setResults(formattedResults);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    const [lng, lat] = result.center;
    const cityName = result.place_name.split(",")[0];
    onSelect(lat, lng);
    setQuery(cityName);

    // Look up the city in our database to get the shortName
    const knownCity = CITIES.find(
      (c) => c.name.toLowerCase() === cityName.toLowerCase()
    );
    setCityName(cityName, knownCity?.shortName);

    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search for a city..."
          className="w-72 px-4 py-2 pl-10 bg-background/95 backdrop-blur border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-background border rounded-lg shadow-lg overflow-hidden z-50">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className="w-full px-4 py-2 text-left hover:bg-accent transition-colors"
            >
              <div className="font-medium">
                {result.place_name.split(",")[0]}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {result.place_name}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
