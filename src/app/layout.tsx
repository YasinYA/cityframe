import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://cityframe.app"),
  title: {
    default: "City Frame - City Wallpaper Generator",
    template: "%s | City Frame",
  },
  description:
    "Create stunning, device-perfect wallpapers from any city in the world. Premium map styles, instant download. Better than Cartogram.",
  keywords: [
    "wallpaper generator",
    "city wallpaper",
    "map wallpaper",
    "phone wallpaper",
    "desktop wallpaper",
    "custom wallpaper",
    "cartogram alternative",
  ],
  authors: [{ name: "City Frame" }],
  creator: "City Frame",
  publisher: "City Frame",
  openGraph: {
    title: "City Frame - City Wallpaper Generator",
    description:
      "Create stunning, device-perfect wallpapers from any city in the world.",
    url: "https://cityframe.app",
    siteName: "City Frame",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "City Frame - City Wallpaper Generator",
    description:
      "Create stunning, device-perfect wallpapers from any city in the world.",
    creator: "@cityframe",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Using MapLibre GL (open-source) - CSS loaded via component */}
      </head>
      <body className={inter.className}>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
