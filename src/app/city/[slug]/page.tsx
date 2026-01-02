import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCityBySlug, CITIES } from "@/lib/cities";
import { MAP_STYLES } from "@/lib/map/styles";
import { CityPageClient } from "./client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all cities
export async function generateStaticParams() {
  return CITIES.map((city) => ({
    slug: city.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    return {
      title: "City Not Found | CityFrame",
    };
  }

  const title = `${city.name} Wallpapers | CityFrame`;
  const description = `Create stunning ${city.name}, ${city.country} wallpapers for your phone, tablet, and desktop. ${city.description}. Download high-resolution map wallpapers instantly.`;
  const url = `https://cityframe.app/city/${city.slug}`;

  return {
    title,
    description,
    keywords: [
      `${city.name} wallpaper`,
      `${city.name} map wallpaper`,
      `${city.name} city wallpaper`,
      `${city.country} wallpaper`,
      "map wallpaper",
      "city wallpaper",
      "phone wallpaper",
      "desktop wallpaper",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "CityFrame",
      type: "website",
      images: [
        {
          url: `/api/og?city=${city.slug}`,
          width: 1200,
          height: 630,
          alt: `${city.name} Map Wallpaper`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og?city=${city.slug}`],
    },
    alternates: {
      canonical: url,
    },
  };
}

// JSON-LD structured data
function generateJsonLd(city: NonNullable<ReturnType<typeof getCityBySlug>>) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${city.name} Wallpapers`,
    description: `Create stunning ${city.name}, ${city.country} wallpapers for your devices.`,
    url: `https://cityframe.app/city/${city.slug}`,
    mainEntity: {
      "@type": "Place",
      name: city.name,
      address: {
        "@type": "PostalAddress",
        addressCountry: city.countryCode,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: city.lat,
        longitude: city.lng,
      },
    },
    publisher: {
      "@type": "Organization",
      name: "CityFrame",
      url: "https://cityframe.app",
    },
  };
}

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  const jsonLd = generateJsonLd(city);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CityPageClient city={city} styles={MAP_STYLES} />
    </>
  );
}
