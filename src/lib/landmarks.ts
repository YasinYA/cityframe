/**
 * Landmarks database with iconic monument silhouettes
 * Each landmark has coordinates and an SVG path for its silhouette
 */

export interface Landmark {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  // SVG path data for the silhouette (viewBox is 0 0 100 100)
  svgPath: string;
  // Height multiplier for scaling (1 = normal, 2 = twice as tall)
  scale?: number;
}

export const LANDMARKS: Landmark[] = [
  // Paris, France - Eiffel Tower with lattice detail
  {
    id: "eiffel-tower",
    name: "Eiffel Tower",
    city: "Paris",
    country: "France",
    lat: 48.8584,
    lng: 2.2945,
    svgPath: "M50 2 L50 5 L48 5 L47 8 L53 8 L52 5 L50 5 M44 12 L42 12 L38 25 L36 25 L32 45 L30 45 L26 65 L24 65 L20 95 L38 95 L38 75 L40 75 L42 65 L44 65 L45 55 L46 55 L47 45 L48 45 L49 35 L50 35 L51 35 L52 45 L53 45 L54 55 L55 55 L56 65 L58 65 L60 75 L62 75 L62 95 L80 95 L76 65 L74 65 L70 45 L68 45 L64 25 L62 25 L58 12 L56 12 L53 8 L47 8 L44 12 M43 35 L43 40 L47 40 L47 35 L43 35 M53 35 L53 40 L57 40 L57 35 L53 35 M40 50 L40 58 L45 58 L45 50 L40 50 M55 50 L55 58 L60 58 L60 50 L55 50 M35 70 L35 80 L42 80 L42 70 L35 70 M58 70 L58 80 L65 80 L65 70 L58 70",
    scale: 1.3,
  },
  // New York, USA - Statue of Liberty with torch and crown
  {
    id: "statue-of-liberty",
    name: "Statue of Liberty",
    city: "New York",
    country: "USA",
    lat: 40.6892,
    lng: -74.0445,
    svgPath: "M62 2 L64 2 L65 8 L67 8 L67 12 L65 12 L64 10 L62 10 L61 12 L59 12 L59 8 L61 8 L62 2 M63 12 L63 18 L61 20 L65 20 L63 18 M50 18 L46 22 L44 22 L42 24 L44 26 L46 24 L48 24 L50 22 L52 22 L54 24 L56 24 L58 26 L60 24 L58 22 L56 22 L54 22 L52 20 L50 18 M50 26 L48 28 L48 32 L52 32 L52 28 L50 26 M47 32 L45 36 L43 36 L40 42 L25 48 L25 52 L40 48 L42 52 L44 52 L45 58 L44 68 L42 95 L58 95 L56 68 L55 58 L56 52 L58 52 L60 48 L75 52 L75 48 L60 42 L57 36 L55 36 L53 32 M44 38 L44 42 L48 42 L48 38 L44 38 M52 38 L52 42 L56 42 L56 38 L52 38",
    scale: 1.2,
  },
  // London, UK - Big Ben with clock face detail
  {
    id: "big-ben",
    name: "Big Ben",
    city: "London",
    country: "UK",
    lat: 51.5007,
    lng: -0.1246,
    svgPath: "M50 2 L48 5 L46 5 L44 8 L42 8 L42 12 L44 12 L44 15 L46 15 L46 12 L48 12 L48 15 L50 12 L52 15 L52 12 L54 12 L54 15 L56 15 L56 12 L58 12 L58 8 L56 8 L54 5 L52 5 L50 2 M44 18 L44 28 L42 28 L42 32 L40 32 L40 95 L42 95 L42 70 L44 70 L44 65 L46 65 L46 60 L48 60 L48 55 L52 55 L52 60 L54 60 L54 65 L56 65 L56 70 L58 70 L58 95 L60 95 L60 32 L58 32 L58 28 L56 28 L56 18 L44 18 M46 35 L46 50 L54 50 L54 35 L46 35 M48 38 L48 42 L50 38 L48 38 M50 42 L52 42 L52 46 L50 46 L50 42 M48 46 L48 48 L50 48 L50 46",
    scale: 1.2,
  },
  // Sydney, Australia - Opera House with shell roofs
  {
    id: "sydney-opera-house",
    name: "Sydney Opera House",
    city: "Sydney",
    country: "Australia",
    lat: -33.8568,
    lng: 151.2153,
    svgPath: "M5 95 L5 85 L10 85 L12 80 C15 50 22 35 30 70 L32 75 C35 45 42 25 50 65 L52 70 C55 40 62 20 70 60 L72 65 C75 35 82 15 90 55 L92 60 L95 60 L95 95 Z M15 82 L15 78 C18 60 22 50 28 72 L28 82 L15 82 M35 78 L35 72 C38 52 42 40 48 68 L48 78 L35 78 M55 75 L55 68 C58 48 62 35 68 62 L68 75 L55 75 M75 70 L75 62 C78 42 82 30 88 58 L88 70 L75 70",
    scale: 1.0,
  },
  // Dubai, UAE - Burj Khalifa with stepped design
  {
    id: "burj-khalifa",
    name: "Burj Khalifa",
    city: "Dubai",
    country: "UAE",
    lat: 25.1972,
    lng: 55.2744,
    svgPath: "M50 0 L50 8 L49 8 L49 15 L48 15 L48 25 L47 25 L47 35 L46 35 L46 45 L45 45 L45 55 L44 55 L44 65 L43 65 L43 75 L42 75 L42 85 L40 85 L40 95 L60 95 L60 85 L58 85 L58 75 L57 75 L57 65 L56 65 L56 55 L55 55 L55 45 L54 45 L54 35 L53 35 L53 25 L52 25 L52 15 L51 15 L51 8 L50 8 M46 50 L46 52 L48 52 L48 50 L46 50 M52 50 L52 52 L54 52 L54 50 L52 50 M44 65 L44 68 L47 68 L47 65 L44 65 M53 65 L53 68 L56 68 L56 65 L53 65 M42 80 L42 85 L46 85 L46 80 L42 80 M54 80 L54 85 L58 85 L58 80 L54 80",
    scale: 1.5,
  },
  // Tokyo, Japan - Tokyo Tower with observation decks
  {
    id: "tokyo-tower",
    name: "Tokyo Tower",
    city: "Tokyo",
    country: "Japan",
    lat: 35.6586,
    lng: 139.7454,
    svgPath: "M50 2 L50 8 L48 10 L52 10 L50 8 M46 14 L44 14 L42 18 L40 18 L38 22 L36 22 L30 40 L28 40 L28 45 L34 45 L34 42 L36 42 L38 38 L40 38 L42 34 L44 34 L46 30 L48 30 L48 26 L52 26 L52 30 L54 30 L56 34 L58 34 L60 38 L62 38 L64 42 L66 42 L66 45 L72 45 L72 40 L70 40 L64 22 L62 22 L60 18 L58 18 L56 14 L54 14 L52 10 L48 10 L46 14 M32 50 L32 55 L38 55 L40 52 L42 55 L46 55 L48 52 L50 55 L52 52 L54 55 L58 55 L60 52 L62 55 L68 55 L68 50 L32 50 M34 58 L28 95 L42 95 L44 75 L48 75 L48 70 L52 70 L52 75 L56 75 L58 95 L72 95 L66 58 L34 58 M44 62 L44 68 L48 68 L48 62 L44 62 M52 62 L52 68 L56 68 L56 62 L52 62",
    scale: 1.2,
  },
  // Rome, Italy - Colosseum with arches
  {
    id: "colosseum",
    name: "Colosseum",
    city: "Rome",
    country: "Italy",
    lat: 41.8902,
    lng: 12.4922,
    svgPath: "M10 95 L10 55 C10 35 25 25 50 25 C75 25 90 35 90 55 L90 95 Z M15 55 C15 40 30 32 50 32 C70 32 85 40 85 55 L85 90 L15 90 L15 55 M20 42 C20 38 22 36 25 38 C28 36 30 38 30 42 L30 50 L20 50 L20 42 M35 42 C35 38 37 36 40 38 C43 36 45 38 45 42 L45 50 L35 50 L35 42 M50 42 C50 38 52 36 55 38 C58 36 60 38 60 42 L60 50 L50 50 L50 42 M65 42 C65 38 67 36 70 38 C73 36 75 38 75 42 L75 50 L65 50 L65 42 M20 58 C20 54 22 52 25 54 C28 52 30 54 30 58 L30 68 L20 68 L20 58 M35 58 C35 54 37 52 40 54 C43 52 45 54 45 58 L45 68 L35 68 L35 58 M50 58 C50 54 52 52 55 54 C58 52 60 54 60 58 L60 68 L50 68 L50 58 M65 58 C65 54 67 52 70 54 C73 52 75 54 75 58 L75 68 L65 68 L65 58 M20 75 L20 85 L30 85 L30 75 L20 75 M35 75 L35 85 L45 85 L45 75 L35 75 M50 75 L50 85 L60 85 L60 75 L50 75 M65 75 L65 85 L75 85 L75 75 L65 75",
    scale: 1.0,
  },
  // San Francisco, USA - Golden Gate Bridge with cables
  {
    id: "golden-gate-bridge",
    name: "Golden Gate Bridge",
    city: "San Francisco",
    country: "USA",
    lat: 37.8199,
    lng: -122.4783,
    svgPath: "M0 75 L8 75 L8 30 L10 28 L12 26 L14 28 L16 30 L16 75 L84 75 L84 30 L86 28 L88 26 L90 28 L92 30 L92 75 L100 75 L100 85 L0 85 Z M12 32 L12 35 Q30 22 50 20 Q70 22 88 35 L88 32 Q70 18 50 16 Q30 18 12 32 M12 38 L12 42 Q30 28 50 26 Q70 28 88 42 L88 38 Q70 24 50 22 Q30 24 12 38 M12 45 L12 50 Q30 38 50 36 Q70 38 88 50 L88 45 Q70 32 50 30 Q30 32 12 45 M12 55 L12 60 Q30 50 50 48 Q70 50 88 60 L88 55 Q70 45 50 42 Q30 45 12 55 M12 65 L12 70 Q30 62 50 60 Q70 62 88 70 L88 65 Q70 58 50 55 Q30 58 12 65",
    scale: 1.0,
  },
  // Rio de Janeiro, Brazil - Christ the Redeemer with robes
  {
    id: "christ-the-redeemer",
    name: "Christ the Redeemer",
    city: "Rio de Janeiro",
    country: "Brazil",
    lat: -22.9519,
    lng: -43.2105,
    svgPath: "M50 8 C54 8 56 12 56 16 C56 20 54 24 50 24 C46 24 44 20 44 16 C44 12 46 8 50 8 M50 26 L50 30 L20 36 L18 38 L18 44 L20 46 L22 44 L24 46 L48 40 L48 70 L44 72 L40 95 L60 95 L56 72 L52 70 L52 40 L76 46 L78 44 L80 46 L82 44 L82 38 L80 36 L50 30 M46 32 L46 38 L48 40 L48 32 L46 32 M52 32 L52 40 L54 38 L54 32 L52 32 M44 50 L44 65 L48 65 L48 50 L44 50 M52 50 L52 65 L56 65 L56 50 L52 50",
    scale: 1.1,
  },
  // Moscow, Russia - Saint Basil's with onion domes
  {
    id: "saint-basils-cathedral",
    name: "Saint Basil's Cathedral",
    city: "Moscow",
    country: "Russia",
    lat: 55.7525,
    lng: 37.6231,
    svgPath: "M50 2 L50 6 C54 8 56 14 54 20 C52 26 48 26 46 20 C44 14 46 8 50 6 M30 12 L30 16 C34 18 36 24 34 30 C32 36 28 36 26 30 C24 24 26 18 30 16 M70 12 L70 16 C74 18 76 24 74 30 C72 36 68 36 66 30 C64 24 66 18 70 16 M20 25 L20 29 C24 31 26 37 24 43 C22 49 18 49 16 43 C14 37 16 31 20 29 M80 25 L80 29 C84 31 86 37 84 43 C82 49 78 49 76 43 C74 37 76 31 80 29 M46 24 L46 45 L28 45 L28 35 L24 48 L14 48 L14 95 L38 95 L38 55 L46 55 L46 50 L54 50 L54 55 L62 55 L62 95 L86 95 L86 48 L76 48 L72 35 L72 45 L54 45 L54 24 L46 24 M22 60 L22 75 L32 75 L32 60 L22 60 M42 62 L42 80 L50 80 L50 62 L42 62 M68 60 L68 75 L78 75 L78 60 L68 60",
    scale: 1.1,
  },
  // Cairo, Egypt - Pyramids with detail
  {
    id: "pyramids-of-giza",
    name: "Pyramids of Giza",
    city: "Cairo",
    country: "Egypt",
    lat: 29.9792,
    lng: 31.1342,
    svgPath: "M5 95 L40 25 L75 95 Z M40 35 L40 40 L38 40 L38 45 L42 45 L42 40 L40 40 M35 50 L35 55 L45 55 L45 50 L35 50 M30 60 L30 65 L50 65 L50 60 L30 60 M25 72 L25 78 L55 78 L55 72 L25 72 M20 85 L20 90 L60 90 L60 85 L20 85 M45 95 L70 50 L95 95 Z M70 58 L70 62 L68 62 L68 66 L72 66 L72 62 L70 62 M66 72 L66 76 L74 76 L74 72 L66 72 M62 82 L62 88 L78 88 L78 82 L62 82",
    scale: 1.0,
  },
  // Singapore - Marina Bay Sands with ship on top
  {
    id: "marina-bay-sands",
    name: "Marina Bay Sands",
    city: "Singapore",
    country: "Singapore",
    lat: 1.2834,
    lng: 103.8607,
    svgPath: "M5 18 C8 14 15 12 50 12 C85 12 92 14 95 18 L95 22 C92 20 85 18 50 18 C15 18 8 20 5 22 Z M10 25 L12 25 L14 95 L22 95 L24 35 L28 35 L28 95 L32 95 L32 30 L36 30 L36 95 L64 95 L64 30 L68 30 L68 95 L72 95 L72 35 L76 35 L78 95 L86 95 L88 25 L90 25 L90 95 L10 95 L10 25 M18 40 L18 50 L22 50 L22 40 L18 40 M18 55 L18 70 L22 70 L22 55 L18 55 M18 75 L18 90 L22 90 L22 75 L18 75 M78 40 L78 50 L82 50 L82 40 L78 40 M78 55 L78 70 L82 70 L82 55 L78 55 M78 75 L78 90 L82 90 L82 75 L78 75 M40 40 L40 55 L48 55 L48 40 L40 40 M52 40 L52 55 L60 55 L60 40 L52 40 M40 60 L40 75 L48 75 L48 60 L40 60 M52 60 L52 75 L60 75 L60 60 L52 60",
    scale: 1.0,
  },
  // Berlin, Germany - Brandenburg Gate with columns and quadriga
  {
    id: "brandenburg-gate",
    name: "Brandenburg Gate",
    city: "Berlin",
    country: "Germany",
    lat: 52.5163,
    lng: 13.3777,
    svgPath: "M42 8 L42 5 L44 5 L44 2 L56 2 L56 5 L58 5 L58 8 L55 8 L55 12 L58 15 L58 18 L42 18 L42 15 L45 12 L45 8 L42 8 M10 95 L10 50 L15 50 L15 45 L20 40 L20 50 L25 50 L25 45 L30 40 L30 50 L35 50 L35 45 L40 40 L40 50 L42 50 L42 22 L58 22 L58 50 L60 50 L60 40 L65 45 L65 50 L70 50 L70 40 L75 45 L75 50 L80 50 L80 40 L85 45 L85 50 L90 50 L90 95 Z M8 45 L50 20 L92 45 L92 48 L8 48 Z M15 55 L15 90 L20 90 L20 55 L15 55 M25 55 L25 90 L30 90 L30 55 L25 55 M35 55 L35 90 L40 90 L40 55 L35 55 M60 55 L60 90 L65 90 L65 55 L60 55 M70 55 L70 90 L75 90 L75 55 L70 55 M80 55 L80 90 L85 90 L85 55 L80 55 M44 55 L44 90 L56 90 L56 55 L44 55",
    scale: 1.0,
  },
  // Athens, Greece - Parthenon with detailed columns
  {
    id: "parthenon",
    name: "Parthenon",
    city: "Athens",
    country: "Greece",
    lat: 37.9715,
    lng: 23.7267,
    svgPath: "M10 30 L50 10 L90 30 L90 38 L10 38 Z M15 42 L15 82 L19 82 L19 45 L21 45 L21 82 L25 82 L25 42 L15 42 M29 42 L29 82 L33 82 L33 45 L35 45 L35 82 L39 82 L39 42 L29 42 M43 42 L43 82 L47 82 L47 45 L49 45 L49 82 L53 82 L53 42 L43 42 M57 42 L57 82 L61 82 L61 45 L63 45 L63 82 L67 82 L67 42 L57 42 M71 42 L71 82 L75 82 L75 45 L77 45 L77 82 L81 82 L81 42 L71 42 M85 42 L85 82 L89 82 L89 42 L85 42 M8 85 L92 85 L92 95 L8 95 Z M12 22 L50 8 L88 22 L88 26 L12 26 Z",
    scale: 0.9,
  },
  // Seattle, USA - Space Needle with UFO top
  {
    id: "space-needle",
    name: "Space Needle",
    city: "Seattle",
    country: "USA",
    lat: 47.6205,
    lng: -122.3493,
    svgPath: "M50 2 L52 5 L55 8 L60 12 L65 15 L75 20 L80 22 L80 28 L75 30 L65 32 L55 32 L54 88 L58 90 L60 95 L40 95 L42 90 L46 88 L45 32 L35 32 L25 30 L20 28 L20 22 L25 20 L35 15 L40 12 L45 8 L48 5 L50 2 M30 24 L30 26 L70 26 L70 24 L30 24 M47 35 L47 55 L53 55 L53 35 L47 35 M46 58 L46 85 L54 85 L54 58 L46 58 M48 12 L48 18 L52 18 L52 12 L48 12 M40 18 L40 22 L45 22 L45 18 L40 18 M55 18 L55 22 L60 22 L60 18 L55 18",
    scale: 1.2,
  },
];

/**
 * Find landmarks near a given location
 * @param lat Latitude
 * @param lng Longitude
 * @param radiusKm Radius in kilometers (default 50km)
 */
export function findNearbyLandmarks(lat: number, lng: number, radiusKm: number = 50): Landmark[] {
  return LANDMARKS.filter((landmark) => {
    const distance = getDistanceKm(lat, lng, landmark.lat, landmark.lng);
    return distance <= radiusKm;
  });
}

/**
 * Calculate distance between two points using Haversine formula
 */
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Get all unique cities that have landmarks
 */
export function getLandmarkCities(): string[] {
  return Array.from(new Set(LANDMARKS.map((l) => l.city)));
}
