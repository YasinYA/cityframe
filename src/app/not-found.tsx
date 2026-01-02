import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Map, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6">
          <Map className="w-10 h-10 text-primary" />
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-xl font-semibold text-muted-foreground mb-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on the map.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/city/new-york">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4" />
              Explore Cities
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
