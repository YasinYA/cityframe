export interface City {
  slug: string;
  name: string;
  shortName?: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  population: number;
  timezone: string;
  description: string;
}

// Top 100 cities for SEO pages
export const CITIES: City[] = [
  // North America
  { slug: "new-york", name: "New York", shortName: "NYC", country: "United States", countryCode: "US", lat: 40.7128, lng: -74.006, population: 8336817, timezone: "America/New_York", description: "The city that never sleeps, known for its iconic skyline and bustling streets" },
  { slug: "los-angeles", name: "Los Angeles", shortName: "LA", country: "United States", countryCode: "US", lat: 34.0522, lng: -118.2437, population: 3979576, timezone: "America/Los_Angeles", description: "City of Angels, home to Hollywood and beautiful beaches" },
  { slug: "chicago", name: "Chicago", shortName: "CHI", country: "United States", countryCode: "US", lat: 41.8781, lng: -87.6298, population: 2693976, timezone: "America/Chicago", description: "The Windy City, famous for architecture and deep-dish pizza" },
  { slug: "houston", name: "Houston", shortName: "HOU", country: "United States", countryCode: "US", lat: 29.7604, lng: -95.3698, population: 2320268, timezone: "America/Chicago", description: "Space City, home to NASA and diverse culinary scene" },
  { slug: "phoenix", name: "Phoenix", shortName: "PHX", country: "United States", countryCode: "US", lat: 33.4484, lng: -112.074, population: 1680992, timezone: "America/Phoenix", description: "Valley of the Sun, desert metropolis with stunning landscapes" },
  { slug: "san-francisco", name: "San Francisco", shortName: "SF", country: "United States", countryCode: "US", lat: 37.7749, lng: -122.4194, population: 883305, timezone: "America/Los_Angeles", description: "City by the Bay, known for the Golden Gate and tech innovation" },
  { slug: "seattle", name: "Seattle", shortName: "SEA", country: "United States", countryCode: "US", lat: 47.6062, lng: -122.3321, population: 753675, timezone: "America/Los_Angeles", description: "Emerald City, birthplace of coffee culture and grunge music" },
  { slug: "miami", name: "Miami", shortName: "MIA", country: "United States", countryCode: "US", lat: 25.7617, lng: -80.1918, population: 467963, timezone: "America/New_York", description: "Magic City, tropical paradise with vibrant nightlife" },
  { slug: "boston", name: "Boston", shortName: "BOS", country: "United States", countryCode: "US", lat: 42.3601, lng: -71.0589, population: 692600, timezone: "America/New_York", description: "Historic city, cradle of American revolution and education" },
  { slug: "toronto", name: "Toronto", shortName: "TOR", country: "Canada", countryCode: "CA", lat: 43.6532, lng: -79.3832, population: 2731571, timezone: "America/Toronto", description: "Canada's largest city, multicultural hub with iconic CN Tower" },
  { slug: "vancouver", name: "Vancouver", shortName: "VAN", country: "Canada", countryCode: "CA", lat: 49.2827, lng: -123.1207, population: 631486, timezone: "America/Vancouver", description: "Pacific jewel surrounded by mountains and ocean" },
  { slug: "mexico-city", name: "Mexico City", shortName: "CDMX", country: "Mexico", countryCode: "MX", lat: 19.4326, lng: -99.1332, population: 8918653, timezone: "America/Mexico_City", description: "Ancient Aztec capital, vibrant culture and cuisine" },

  // Europe
  { slug: "london", name: "London", shortName: "LDN", country: "United Kingdom", countryCode: "GB", lat: 51.5074, lng: -0.1278, population: 8982000, timezone: "Europe/London", description: "Historic capital, home to Big Ben and royal palaces" },
  { slug: "paris", name: "Paris", shortName: "PAR", country: "France", countryCode: "FR", lat: 48.8566, lng: 2.3522, population: 2161000, timezone: "Europe/Paris", description: "City of Light, romantic capital with the Eiffel Tower" },
  { slug: "berlin", name: "Berlin", shortName: "BER", country: "Germany", countryCode: "DE", lat: 52.52, lng: 13.405, population: 3644826, timezone: "Europe/Berlin", description: "Creative capital, rich history and vibrant arts scene" },
  { slug: "rome", name: "Rome", shortName: "ROM", country: "Italy", countryCode: "IT", lat: 41.9028, lng: 12.4964, population: 2873000, timezone: "Europe/Rome", description: "Eternal City, ancient ruins and Renaissance masterpieces" },
  { slug: "madrid", name: "Madrid", shortName: "MAD", country: "Spain", countryCode: "ES", lat: 40.4168, lng: -3.7038, population: 3223000, timezone: "Europe/Madrid", description: "Spanish capital, world-class art and lively plazas" },
  { slug: "barcelona", name: "Barcelona", shortName: "BCN", country: "Spain", countryCode: "ES", lat: 41.3851, lng: 2.1734, population: 1620000, timezone: "Europe/Madrid", description: "Catalan gem, Gaudí architecture and Mediterranean beaches" },
  { slug: "amsterdam", name: "Amsterdam", shortName: "AMS", country: "Netherlands", countryCode: "NL", lat: 52.3676, lng: 4.9041, population: 872680, timezone: "Europe/Amsterdam", description: "Canal city, artistic heritage and cycling culture" },
  { slug: "vienna", name: "Vienna", shortName: "VIE", country: "Austria", countryCode: "AT", lat: 48.2082, lng: 16.3738, population: 1897000, timezone: "Europe/Vienna", description: "Imperial capital, classical music and coffee houses" },
  { slug: "prague", name: "Prague", shortName: "PRG", country: "Czech Republic", countryCode: "CZ", lat: 50.0755, lng: 14.4378, population: 1309000, timezone: "Europe/Prague", description: "City of a Hundred Spires, medieval charm and beer culture" },
  { slug: "lisbon", name: "Lisbon", shortName: "LIS", country: "Portugal", countryCode: "PT", lat: 38.7223, lng: -9.1393, population: 505526, timezone: "Europe/Lisbon", description: "Hilly coastal capital with pastel buildings and fado music" },
  { slug: "dublin", name: "Dublin", shortName: "DUB", country: "Ireland", countryCode: "IE", lat: 53.3498, lng: -6.2603, population: 544107, timezone: "Europe/Dublin", description: "Literary capital, Georgian architecture and warm pubs" },
  { slug: "stockholm", name: "Stockholm", shortName: "STO", country: "Sweden", countryCode: "SE", lat: 59.3293, lng: 18.0686, population: 975904, timezone: "Europe/Stockholm", description: "Venice of the North, spread across 14 islands" },
  { slug: "copenhagen", name: "Copenhagen", shortName: "CPH", country: "Denmark", countryCode: "DK", lat: 55.6761, lng: 12.5683, population: 799033, timezone: "Europe/Copenhagen", description: "Hygge capital, design innovation and cycling paradise" },
  { slug: "oslo", name: "Oslo", shortName: "OSL", country: "Norway", countryCode: "NO", lat: 59.9139, lng: 10.7522, population: 693494, timezone: "Europe/Oslo", description: "Fjord city, nature meets modern Nordic design" },
  { slug: "helsinki", name: "Helsinki", shortName: "HEL", country: "Finland", countryCode: "FI", lat: 60.1699, lng: 24.9384, population: 653835, timezone: "Europe/Helsinki", description: "Design capital, saunas and Baltic Sea views" },
  { slug: "zurich", name: "Zurich", shortName: "ZRH", country: "Switzerland", countryCode: "CH", lat: 47.3769, lng: 8.5417, population: 402762, timezone: "Europe/Zurich", description: "Alpine financial hub with pristine lake and mountains" },
  { slug: "munich", name: "Munich", shortName: "MUC", country: "Germany", countryCode: "DE", lat: 48.1351, lng: 11.582, population: 1471508, timezone: "Europe/Berlin", description: "Bavarian capital, beer gardens and Alpine proximity" },
  { slug: "brussels", name: "Brussels", shortName: "BRU", country: "Belgium", countryCode: "BE", lat: 50.8503, lng: 4.3517, population: 1208542, timezone: "Europe/Brussels", description: "Heart of Europe, art nouveau and chocolate paradise" },
  { slug: "budapest", name: "Budapest", shortName: "BUD", country: "Hungary", countryCode: "HU", lat: 47.4979, lng: 19.0402, population: 1756000, timezone: "Europe/Budapest", description: "Pearl of the Danube, thermal baths and ruin bars" },
  { slug: "warsaw", name: "Warsaw", shortName: "WAW", country: "Poland", countryCode: "PL", lat: 52.2297, lng: 21.0122, population: 1790658, timezone: "Europe/Warsaw", description: "Phoenix city, rebuilt old town and modern skyline" },
  { slug: "athens", name: "Athens", shortName: "ATH", country: "Greece", countryCode: "GR", lat: 37.9838, lng: 23.7275, population: 664046, timezone: "Europe/Athens", description: "Cradle of democracy, ancient Acropolis and Mediterranean charm" },
  { slug: "moscow", name: "Moscow", shortName: "MOW", country: "Russia", countryCode: "RU", lat: 55.7558, lng: 37.6173, population: 12506468, timezone: "Europe/Moscow", description: "Red Square and Kremlin, Russian cultural heart" },
  { slug: "istanbul", name: "Istanbul", shortName: "IST", country: "Turkey", countryCode: "TR", lat: 41.0082, lng: 28.9784, population: 15029231, timezone: "Europe/Istanbul", description: "Where East meets West, Byzantine and Ottoman grandeur" },

  // Asia
  { slug: "tokyo", name: "Tokyo", shortName: "TYO", country: "Japan", countryCode: "JP", lat: 35.6762, lng: 139.6503, population: 13960000, timezone: "Asia/Tokyo", description: "Neon metropolis, ancient temples meet cutting-edge technology" },
  { slug: "osaka", name: "Osaka", shortName: "OSA", country: "Japan", countryCode: "JP", lat: 34.6937, lng: 135.5023, population: 2691000, timezone: "Asia/Tokyo", description: "Japan's kitchen, vibrant nightlife and castle heritage" },
  { slug: "kyoto", name: "Kyoto", shortName: "KYO", country: "Japan", countryCode: "JP", lat: 35.0116, lng: 135.7681, population: 1475000, timezone: "Asia/Tokyo", description: "Cultural heart, thousand temples and geisha traditions" },
  { slug: "seoul", name: "Seoul", shortName: "SEL", country: "South Korea", countryCode: "KR", lat: 37.5665, lng: 126.978, population: 9776000, timezone: "Asia/Seoul", description: "K-pop capital, palaces and futuristic cityscapes" },
  { slug: "beijing", name: "Beijing", shortName: "BEI", country: "China", countryCode: "CN", lat: 39.9042, lng: 116.4074, population: 21540000, timezone: "Asia/Shanghai", description: "Imperial capital, Forbidden City and Great Wall gateway" },
  { slug: "shanghai", name: "Shanghai", shortName: "SHA", country: "China", countryCode: "CN", lat: 31.2304, lng: 121.4737, population: 24870000, timezone: "Asia/Shanghai", description: "Financial hub, art deco Bund meets futuristic Pudong" },
  { slug: "hong-kong", name: "Hong Kong", shortName: "HK", country: "China", countryCode: "HK", lat: 22.3193, lng: 114.1694, population: 7482500, timezone: "Asia/Hong_Kong", description: "Fragrant Harbor, skyscrapers and dim sum paradise" },
  { slug: "singapore", name: "Singapore", shortName: "SG", country: "Singapore", countryCode: "SG", lat: 1.3521, lng: 103.8198, population: 5850342, timezone: "Asia/Singapore", description: "Garden City, futuristic architecture and hawker food" },
  { slug: "bangkok", name: "Bangkok", shortName: "BKK", country: "Thailand", countryCode: "TH", lat: 13.7563, lng: 100.5018, population: 10539000, timezone: "Asia/Bangkok", description: "City of Angels, golden temples and street food heaven" },
  { slug: "mumbai", name: "Mumbai", shortName: "BOM", country: "India", countryCode: "IN", lat: 19.076, lng: 72.8777, population: 20411000, timezone: "Asia/Kolkata", description: "Bollywood capital, colonial architecture and bustling markets" },
  { slug: "delhi", name: "Delhi", shortName: "DEL", country: "India", countryCode: "IN", lat: 28.6139, lng: 77.209, population: 16787941, timezone: "Asia/Kolkata", description: "Historic capital, Mughal monuments and vibrant bazaars" },
  { slug: "dubai", name: "Dubai", shortName: "DXB", country: "United Arab Emirates", countryCode: "AE", lat: 25.2048, lng: 55.2708, population: 3331420, timezone: "Asia/Dubai", description: "Desert miracle, record-breaking skyscrapers and luxury" },
  { slug: "abu-dhabi", name: "Abu Dhabi", shortName: "AUH", country: "United Arab Emirates", countryCode: "AE", lat: 24.4539, lng: 54.3773, population: 1483000, timezone: "Asia/Dubai", description: "Cultural oasis, grand mosque and Formula 1" },
  { slug: "tel-aviv", name: "Tel Aviv", shortName: "TLV", country: "Israel", countryCode: "IL", lat: 32.0853, lng: 34.7818, population: 451523, timezone: "Asia/Jerusalem", description: "White City, Bauhaus architecture and Mediterranean beaches" },
  { slug: "kuala-lumpur", name: "Kuala Lumpur", shortName: "KL", country: "Malaysia", countryCode: "MY", lat: 3.139, lng: 101.6869, population: 1768000, timezone: "Asia/Kuala_Lumpur", description: "Twin Towers city, multicultural melting pot" },
  { slug: "taipei", name: "Taipei", shortName: "TPE", country: "Taiwan", countryCode: "TW", lat: 25.033, lng: 121.5654, population: 2646000, timezone: "Asia/Taipei", description: "Night market capital, temples and tea culture" },
  { slug: "manila", name: "Manila", shortName: "MNL", country: "Philippines", countryCode: "PH", lat: 14.5995, lng: 120.9842, population: 1780148, timezone: "Asia/Manila", description: "Pearl of the Orient, Spanish colonial heritage" },
  { slug: "jakarta", name: "Jakarta", shortName: "JKT", country: "Indonesia", countryCode: "ID", lat: -6.2088, lng: 106.8456, population: 10562088, timezone: "Asia/Jakarta", description: "Indonesian capital, diverse culture and cuisine" },
  { slug: "ho-chi-minh-city", name: "Ho Chi Minh City", shortName: "SGN", country: "Vietnam", countryCode: "VN", lat: 10.8231, lng: 106.6297, population: 8993082, timezone: "Asia/Ho_Chi_Minh", description: "Saigon, French colonial charm and motorbike energy" },
  { slug: "hanoi", name: "Hanoi", shortName: "HAN", country: "Vietnam", countryCode: "VN", lat: 21.0278, lng: 105.8342, population: 8053663, timezone: "Asia/Ho_Chi_Minh", description: "Ancient capital, thousand-year history and pho" },

  // Oceania
  { slug: "sydney", name: "Sydney", shortName: "SYD", country: "Australia", countryCode: "AU", lat: -33.8688, lng: 151.2093, population: 5312163, timezone: "Australia/Sydney", description: "Harbor City, Opera House and iconic beaches" },
  { slug: "melbourne", name: "Melbourne", shortName: "MEL", country: "Australia", countryCode: "AU", lat: -37.8136, lng: 144.9631, population: 5078193, timezone: "Australia/Melbourne", description: "Cultural capital, laneways and coffee obsession" },
  { slug: "brisbane", name: "Brisbane", shortName: "BNE", country: "Australia", countryCode: "AU", lat: -27.4698, lng: 153.0251, population: 2514184, timezone: "Australia/Brisbane", description: "River City, subtropical vibes and outdoor lifestyle" },
  { slug: "auckland", name: "Auckland", shortName: "AKL", country: "New Zealand", countryCode: "NZ", lat: -36.8509, lng: 174.7645, population: 1657200, timezone: "Pacific/Auckland", description: "City of Sails, volcanoes and harbor views" },

  // South America
  { slug: "sao-paulo", name: "São Paulo", shortName: "SP", country: "Brazil", countryCode: "BR", lat: -23.5505, lng: -46.6333, population: 12325232, timezone: "America/Sao_Paulo", description: "Economic powerhouse, art museums and gastronomy" },
  { slug: "rio-de-janeiro", name: "Rio de Janeiro", shortName: "RIO", country: "Brazil", countryCode: "BR", lat: -22.9068, lng: -43.1729, population: 6747815, timezone: "America/Sao_Paulo", description: "Marvelous City, Christ the Redeemer and Copacabana" },
  { slug: "buenos-aires", name: "Buenos Aires", shortName: "BA", country: "Argentina", countryCode: "AR", lat: -34.6037, lng: -58.3816, population: 3075646, timezone: "America/Argentina/Buenos_Aires", description: "Paris of South America, tango and steakhouses" },
  { slug: "lima", name: "Lima", shortName: "LIM", country: "Peru", countryCode: "PE", lat: -12.0464, lng: -77.0428, population: 9752000, timezone: "America/Lima", description: "Culinary capital, pre-Columbian treasures and ceviche" },
  { slug: "bogota", name: "Bogotá", shortName: "BOG", country: "Colombia", countryCode: "CO", lat: 4.711, lng: -74.0721, population: 7181469, timezone: "America/Bogota", description: "Andean capital, street art and emerald city" },
  { slug: "santiago", name: "Santiago", shortName: "SCL", country: "Chile", countryCode: "CL", lat: -33.4489, lng: -70.6693, population: 6158080, timezone: "America/Santiago", description: "Andean backdrop, wine country gateway" },
  { slug: "medellin", name: "Medellín", shortName: "MDE", country: "Colombia", countryCode: "CO", lat: 6.2476, lng: -75.5658, population: 2529403, timezone: "America/Bogota", description: "City of Eternal Spring, innovation and transformation" },
  { slug: "cartagena", name: "Cartagena", shortName: "CTG", country: "Colombia", countryCode: "CO", lat: 10.391, lng: -75.4794, population: 914552, timezone: "America/Bogota", description: "Walled city, Caribbean charm and colonial beauty" },

  // Africa
  { slug: "cairo", name: "Cairo", shortName: "CAI", country: "Egypt", countryCode: "EG", lat: 30.0444, lng: 31.2357, population: 20076000, timezone: "Africa/Cairo", description: "Mother of the World, pyramids and ancient wonders" },
  { slug: "cape-town", name: "Cape Town", shortName: "CPT", country: "South Africa", countryCode: "ZA", lat: -33.9249, lng: 18.4241, population: 433688, timezone: "Africa/Johannesburg", description: "Mother City, Table Mountain and coastal beauty" },
  { slug: "johannesburg", name: "Johannesburg", shortName: "JNB", country: "South Africa", countryCode: "ZA", lat: -26.2041, lng: 28.0473, population: 5635127, timezone: "Africa/Johannesburg", description: "City of Gold, economic heart of Africa" },
  { slug: "marrakech", name: "Marrakech", shortName: "RAK", country: "Morocco", countryCode: "MA", lat: 31.6295, lng: -7.9811, population: 928850, timezone: "Africa/Casablanca", description: "Red City, souks and palaces" },
  { slug: "casablanca", name: "Casablanca", shortName: "CAS", country: "Morocco", countryCode: "MA", lat: 33.5731, lng: -7.5898, population: 3359818, timezone: "Africa/Casablanca", description: "White City, art deco and Hassan II Mosque" },
  { slug: "nairobi", name: "Nairobi", shortName: "NBO", country: "Kenya", countryCode: "KE", lat: -1.2921, lng: 36.8219, population: 4397073, timezone: "Africa/Nairobi", description: "Safari City, national park within city limits" },
  { slug: "lagos", name: "Lagos", shortName: "LOS", country: "Nigeria", countryCode: "NG", lat: 6.5244, lng: 3.3792, population: 14862000, timezone: "Africa/Lagos", description: "Afrobeats capital, vibrant and energetic megacity" },

  // More popular destinations
  { slug: "las-vegas", name: "Las Vegas", shortName: "LV", country: "United States", countryCode: "US", lat: 36.1699, lng: -115.1398, population: 651319, timezone: "America/Los_Angeles", description: "Entertainment capital, neon lights and desert oasis" },
  { slug: "san-diego", name: "San Diego", shortName: "SD", country: "United States", countryCode: "US", lat: 32.7157, lng: -117.1611, population: 1423851, timezone: "America/Los_Angeles", description: "America's Finest City, beaches and perfect weather" },
  { slug: "denver", name: "Denver", shortName: "DEN", country: "United States", countryCode: "US", lat: 39.7392, lng: -104.9903, population: 727211, timezone: "America/Denver", description: "Mile High City, Rocky Mountain gateway" },
  { slug: "portland", name: "Portland", shortName: "PDX", country: "United States", countryCode: "US", lat: 45.5152, lng: -122.6784, population: 654741, timezone: "America/Los_Angeles", description: "Keep Portland Weird, food carts and craft beer" },
  { slug: "austin", name: "Austin", shortName: "ATX", country: "United States", countryCode: "US", lat: 30.2672, lng: -97.7431, population: 978908, timezone: "America/Chicago", description: "Live Music Capital, tech hub and food scene" },
  { slug: "nashville", name: "Nashville", shortName: "NSH", country: "United States", countryCode: "US", lat: 36.1627, lng: -86.7816, population: 689447, timezone: "America/Chicago", description: "Music City, country music and hot chicken" },
  { slug: "new-orleans", name: "New Orleans", shortName: "NOLA", country: "United States", countryCode: "US", lat: 29.9511, lng: -90.0715, population: 391006, timezone: "America/Chicago", description: "The Big Easy, jazz and Creole culture" },
  { slug: "montreal", name: "Montreal", shortName: "MTL", country: "Canada", countryCode: "CA", lat: 45.5017, lng: -73.5673, population: 1762949, timezone: "America/Montreal", description: "La Belle Ville, European charm in North America" },
  { slug: "florence", name: "Florence", shortName: "FLR", country: "Italy", countryCode: "IT", lat: 43.7696, lng: 11.2558, population: 382258, timezone: "Europe/Rome", description: "Renaissance birthplace, art and Tuscan beauty" },
  { slug: "venice", name: "Venice", shortName: "VCE", country: "Italy", countryCode: "IT", lat: 45.4408, lng: 12.3155, population: 261905, timezone: "Europe/Rome", description: "Floating city, canals and timeless romance" },
  { slug: "edinburgh", name: "Edinburgh", shortName: "EDI", country: "United Kingdom", countryCode: "GB", lat: 55.9533, lng: -3.1883, population: 488050, timezone: "Europe/London", description: "Festival city, castle and literary heritage" },
  { slug: "milan", name: "Milan", shortName: "MIL", country: "Italy", countryCode: "IT", lat: 45.4642, lng: 9.19, population: 1352000, timezone: "Europe/Rome", description: "Fashion capital, Duomo and design innovation" },
  { slug: "nice", name: "Nice", shortName: "NCE", country: "France", countryCode: "FR", lat: 43.7102, lng: 7.262, population: 340017, timezone: "Europe/Paris", description: "Riviera gem, azure coast and Belle Époque glamour" },
  { slug: "reykjavik", name: "Reykjavik", shortName: "REK", country: "Iceland", countryCode: "IS", lat: 64.1466, lng: -21.9426, population: 131136, timezone: "Atlantic/Reykjavik", description: "Northern capital, aurora borealis and geothermal wonders" },
  { slug: "bali", name: "Bali", shortName: "DPS", country: "Indonesia", countryCode: "ID", lat: -8.3405, lng: 115.092, population: 4225000, timezone: "Asia/Makassar", description: "Island of Gods, temples and tropical paradise" },
];

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((city) => city.slug === slug);
}

export function getCitiesByCountry(countryCode: string): City[] {
  return CITIES.filter((city) => city.countryCode === countryCode);
}

export function getPopularCities(limit: number = 20): City[] {
  return [...CITIES].sort((a, b) => b.population - a.population).slice(0, limit);
}

export function searchCities(query: string): City[] {
  const lowerQuery = query.toLowerCase();
  return CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery)
  ).slice(0, 10);
}

export function getCityDisplayName(city: City): string {
  return city.shortName || city.name;
}

// City to style mapping for OG images (top cities matched with fitting styles)
export const CITY_OG_STYLES: Record<string, string> = {
  // North America
  "new-york": "midnight-gold",
  "los-angeles": "sunset-vibrant",
  "chicago": "copper-industrial",
  "houston": "slate-minimal",
  "phoenix": "desert-sand",
  "san-francisco": "deep-ocean",
  "seattle": "forest-night",
  "miami": "neon-city",
  "boston": "autumn",
  "toronto": "arctic-frost",
  "vancouver": "forest-night",
  "mexico-city": "terracotta",
  "las-vegas": "neon-city",
  "san-diego": "deep-ocean",
  "denver": "slate-minimal",
  "portland": "sage-minimalist",
  "austin": "sunset-vibrant",
  "nashville": "warm-beige",
  "new-orleans": "rose-noir",
  "montreal": "nordic-navy",

  // Europe
  "london": "noir",
  "paris": "rose-noir",
  "berlin": "blueprint",
  "rome": "terracotta",
  "madrid": "sunset-vibrant",
  "barcelona": "terracotta",
  "amsterdam": "deep-ocean",
  "vienna": "midnight-gold",
  "prague": "autumn",
  "lisbon": "pastel-dream",
  "dublin": "forest-night",
  "stockholm": "nordic-navy",
  "copenhagen": "arctic-frost",
  "oslo": "arctic-frost",
  "helsinki": "arctic-frost",
  "zurich": "slate-minimal",
  "munich": "copper-industrial",
  "brussels": "warm-beige",
  "budapest": "midnight-gold",
  "warsaw": "slate-minimal",
  "athens": "terracotta",
  "moscow": "noir",
  "istanbul": "rose-noir",
  "florence": "terracotta",
  "venice": "deep-ocean",
  "edinburgh": "forest-night",
  "milan": "slate-minimal",
  "nice": "lavender-haze",
  "reykjavik": "arctic-frost",

  // Asia
  "tokyo": "neon-city",
  "osaka": "cherry-blossom",
  "kyoto": "japanese-ink",
  "seoul": "neon-city",
  "beijing": "rose-noir",
  "shanghai": "midnight-gold",
  "hong-kong": "neon-city",
  "singapore": "deep-ocean",
  "bangkok": "sunset-vibrant",
  "mumbai": "terracotta",
  "delhi": "desert-sand",
  "dubai": "desert-sand",
  "abu-dhabi": "desert-sand",
  "tel-aviv": "deep-ocean",
  "kuala-lumpur": "forest-night",
  "taipei": "neon-city",
  "manila": "sunset-vibrant",
  "jakarta": "warm-beige",
  "ho-chi-minh-city": "sunset-vibrant",
  "hanoi": "japanese-ink",
  "bali": "forest-night",

  // Oceania
  "sydney": "deep-ocean",
  "melbourne": "slate-minimal",
  "brisbane": "sunset-vibrant",
  "auckland": "deep-ocean",

  // South America
  "sao-paulo": "copper-industrial",
  "rio-de-janeiro": "sunset-vibrant",
  "buenos-aires": "noir",
  "lima": "terracotta",
  "bogota": "forest-night",
  "santiago": "slate-minimal",
  "medellin": "sage-minimalist",
  "cartagena": "terracotta",

  // Africa
  "cairo": "desert-sand",
  "cape-town": "deep-ocean",
  "johannesburg": "midnight-gold",
  "marrakech": "desert-sand",
  "casablanca": "warm-beige",
  "nairobi": "sage-minimalist",
  "lagos": "sunset-vibrant",
};

export function getCityOgStyle(slug: string): string | undefined {
  return CITY_OG_STYLES[slug];
}
