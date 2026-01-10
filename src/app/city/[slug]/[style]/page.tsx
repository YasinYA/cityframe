import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCityBySlug, CITIES } from "@/lib/cities";
import { MAP_STYLES, getStyleById } from "@/lib/map/styles";
import { CityStylePageClient } from "./client";

interface PageProps {
  params: Promise<{ slug: string; style: string }>;
}

// Generate static params for all city + style combinations
export async function generateStaticParams() {
  const params: { slug: string; style: string }[] = [];

  for (const city of CITIES) {
    for (const style of MAP_STYLES) {
      params.push({
        slug: city.slug,
        style: style.id,
      });
    }
  }

  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, style: styleId } = await params;
  const city = getCityBySlug(slug);
  const style = getStyleById(styleId);

  if (!city || !style) {
    return {
      title: "Not Found | City Frame",
    };
  }

  const title = `${city.name} ${style.name} Wallpaper | City Frame`;
  const description = `Download a stunning ${style.name} style wallpaper of ${city.name}, ${city.country}. ${style.description}. Perfect for phone, tablet, and desktop.`;
  const url = `https://cityframe.app/city/${city.slug}/${style.id}`;

  return {
    title,
    description,
    keywords: [
      `${city.name} ${style.name} wallpaper`,
      `${city.name} wallpaper`,
      `${style.name} map wallpaper`,
      `${city.country} wallpaper`,
      "map wallpaper",
      "city wallpaper",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "City Frame",
      type: "website",
      images: [
        {
          url: `/api/og?city=${city.slug}&style=${style.id}`,
          width: 1200,
          height: 630,
          alt: `${city.name} ${style.name} Wallpaper`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og?city=${city.slug}&style=${style.id}`],
    },
    alternates: {
      canonical: url,
    },
  };
}

// JSON-LD structured data
function generateJsonLd(
  city: NonNullable<ReturnType<typeof getCityBySlug>>,
  style: NonNullable<ReturnType<typeof getStyleById>>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: `${city.name} ${style.name} Wallpaper`,
    description: `${style.name} style wallpaper of ${city.name}, ${city.country}`,
    contentUrl: `https://cityframe.app/api/og?city=${city.slug}&style=${style.id}`,
    thumbnailUrl: `https://cityframe.app/api/og?city=${city.slug}&style=${style.id}`,
    creator: {
      "@type": "Organization",
      name: "City Frame",
      url: "https://cityframe.app",
    },
    contentLocation: {
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
  };
}

export default async function CityStylePage({ params }: PageProps) {
  const { slug, style: styleId } = await params;
  const city = getCityBySlug(slug);
  const style = getStyleById(styleId);

  if (!city) {
    notFound();
  }

  if (!style) {
    // Redirect to city page if style doesn't exist
    redirect(`/city/${slug}`);
  }

  const jsonLd = generateJsonLd(city, style);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CityStylePageClient city={city} style={style} allStyles={MAP_STYLES} />
    </>
  );
}
