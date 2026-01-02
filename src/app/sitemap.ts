import { MetadataRoute } from "next";
import { CITIES } from "@/lib/cities";
import { MAP_STYLES } from "@/lib/map/styles";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cityframe.app";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // City pages
  const cityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${baseUrl}/city/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // City + Style pages (only for top 20 cities to avoid huge sitemap)
  const topCities = [...CITIES]
    .sort((a, b) => b.population - a.population)
    .slice(0, 20);

  const cityStylePages: MetadataRoute.Sitemap = topCities.flatMap((city) =>
    MAP_STYLES.map((style) => ({
      url: `${baseUrl}/city/${city.slug}/${style.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [...staticPages, ...cityPages, ...cityStylePages];
}
