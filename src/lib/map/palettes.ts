// Apply style configurations to MapLibre map layers at runtime
import type { Map as MapLibreMap } from "maplibre-gl";
import { getStyleConfig, getRoadColors, DEFAULT_ROAD_WIDTHS, type StyleConfig } from "./styles";

// Layer IDs from OpenFreeMap/OpenMapTiles schema
// Organized by road hierarchy for MapToPoster-style coloring
const ROAD_HIERARCHY = {
  motorway: [
    "tunnel_motorway",
    "road_motorway",
    "bridge_motorway",
    "tunnel_trunk",
    "road_trunk",
    "bridge_trunk",
  ],
  primary: [
    "tunnel_primary",
    "road_primary",
    "bridge_primary",
  ],
  secondary: [
    "tunnel_secondary",
    "road_secondary",
    "bridge_secondary",
  ],
  tertiary: [
    "tunnel_tertiary",
    "road_tertiary",
    "bridge_tertiary",
  ],
  residential: [
    "tunnel_minor",
    "tunnel_service",
    "road_minor",
    "road_service",
    "road_path",
    "road_pedestrian",
    "road_track",
    "bridge_minor",
    "bridge_service",
  ],
};

// Flat list for backwards compatibility
const ROAD_LAYERS = [
  ...ROAD_HIERARCHY.motorway,
  ...ROAD_HIERARCHY.primary,
  ...ROAD_HIERARCHY.secondary,
  ...ROAD_HIERARCHY.tertiary,
  ...ROAD_HIERARCHY.residential,
  // Casings
  "road_motorway_casing",
  "road_trunk_casing",
  "road_primary_casing",
  "road_secondary_casing",
  "road_tertiary_casing",
  "tunnel_motorway_casing",
  "tunnel_trunk_casing",
  "bridge_motorway_casing",
  "bridge_trunk_casing",
];

const ROAD_CASING_LAYERS = [
  "road_motorway_casing",
  "road_trunk_casing",
  "road_primary_casing",
  "road_secondary_casing",
  "road_tertiary_casing",
  "tunnel_motorway_casing",
  "tunnel_trunk_casing",
  "bridge_motorway_casing",
  "bridge_trunk_casing",
];

const WATER_LAYERS = ["water"];
const WATERWAY_LAYERS = ["waterway_river", "waterway_other", "waterway_tunnel"];
const LANDCOVER_LAYERS = [
  "landcover_grass",
  "landcover_wood",
  "landcover_ice",
  "landcover_sand",
  "landcover_wetland",
];
const LANDUSE_LAYERS = [
  "landuse_residential",
  "landuse_pitch",
  "landuse_cemetery",
  "landuse_hospital",
  "landuse_school",
  "park",
];
const BUILDING_LAYERS = ["building"];
const BUILDING_3D_LAYERS = ["building-3d"];
const LABEL_LAYERS = [
  "label_city",
  "label_town",
  "label_village",
  "label_suburb",
  "label_neighbourhood",
  "label_state",
  "label_country",
  "highway-name-path",
  "highway-name-minor",
  "highway-name-major",
  "poi_label",
  "water_name_point_label",
  "water_name_line_label",
  "waterway_line_label",
];
const BOUNDARY_LAYERS = ["boundary_2", "boundary_3"];
const CONTOUR_LAYERS = ["contour", "contour_line"];
const RAIL_LAYERS = ["road_rail", "road_transit", "bridge_rail"];

// Helper to safely set paint property
function setPaint(map: MapLibreMap, layerId: string, property: string, value: unknown) {
  try {
    if (map.getLayer(layerId)) {
      map.setPaintProperty(layerId, property, value);
    }
  } catch {
    // Layer might not exist in this style
  }
}

// Helper to safely set layout property
function setLayout(map: MapLibreMap, layerId: string, property: string, value: unknown) {
  try {
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, property, value);
    }
  } catch {
    // Layer might not exist
  }
}

// All styles use custom JSON and don't need runtime modifications
const CUSTOM_JSON_STYLES = [
  "midnight-gold",
  "sage-minimalist",
  "sunset-vibrant",
  "deep-ocean",
  "arctic-frost",
  "rose-noir",
  "forest-night",
  "lavender-haze",
  "copper-industrial",
  "slate-minimal",
  "cherry-blossom",
  "desert-sand",
  "nordic-navy",
  "neon-city",
  "japanese-ink",
  "blueprint",
];

// Apply a style configuration to the map
export function applyStyleToMap(map: MapLibreMap, styleId: string): void {
  // Skip for custom JSON styles - they're already fully styled
  if (CUSTOM_JSON_STYLES.includes(styleId)) return;

  const config = getStyleConfig(styleId);
  if (!config) return;

  const { map: mapConfig } = config;

  // Apply background color
  if (mapConfig.background) {
    setPaint(map, "background", "background-color", mapConfig.background);
  }

  // Get road colors (handles both string and object formats)
  const roadColors = getRoadColors(mapConfig.roads);
  const roadWidths = { ...DEFAULT_ROAD_WIDTHS, ...mapConfig.roadWidths };

  // Apply hierarchical road colors (MapToPoster approach)
  Object.entries(ROAD_HIERARCHY).forEach(([level, layers]) => {
    const color = roadColors[level as keyof typeof roadColors];
    const width = roadWidths[level as keyof typeof roadWidths];
    layers.forEach((layerId) => {
      setPaint(map, layerId, "line-color", color);
      setPaint(map, layerId, "line-width", width);
    });
  });

  // Make road casings match background (hide them)
  ROAD_CASING_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, "line-color", mapConfig.background);
  });

  // Apply water color (null = hide, string = color)
  const waterColor = mapConfig.water === null ? mapConfig.background : (mapConfig.water || mapConfig.background);
  WATER_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, "fill-color", waterColor);
  });
  WATERWAY_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, "line-color", waterColor);
  });

  // Apply parks color (null = hide)
  const parksColor = mapConfig.parks === null ? mapConfig.background : (mapConfig.parks || mapConfig.background);
  const parksOpacity = mapConfig.parks === null ? 0 : 1;

  // Hide landcover - make same as background
  LANDCOVER_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, "fill-color", parksColor);
    setPaint(map, layerId, "fill-opacity", parksOpacity);
  });

  // Hide landuse (parks fall under this)
  LANDUSE_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, "fill-color", parksColor);
    setPaint(map, layerId, "fill-opacity", parksOpacity);
  });

  // Apply buildings color (null = hide)
  const buildingColor = mapConfig.buildings === null ? mapConfig.background : (mapConfig.buildings || mapConfig.background);
  const buildingOpacity = mapConfig.buildings === null ? 0 : 0.3;
  BUILDING_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, "fill-color", buildingColor);
    setPaint(map, layerId, "fill-opacity", buildingOpacity);
  });
  BUILDING_3D_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, "fill-extrusion-color", buildingColor);
    setPaint(map, layerId, "fill-extrusion-opacity", buildingOpacity);
  });

  // Hide or show labels
  LABEL_LAYERS.forEach((layerId) => {
    setLayout(map, layerId, "visibility", mapConfig.labels ? "visible" : "none");
  });

  // Hide boundaries
  BOUNDARY_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, "line-opacity", 0);
  });

  // Hide rail
  RAIL_LAYERS.forEach((layerId) => {
    setPaint(map, layerId, "line-opacity", 0);
  });

  // Apply contours if enabled
  if (mapConfig.contours && mapConfig.contourColor) {
    CONTOUR_LAYERS.forEach((layerId) => {
      setPaint(map, layerId, "line-color", mapConfig.contourColor!);
      setPaint(map, layerId, "line-opacity", 1);
      if (mapConfig.contourWidth) {
        setPaint(map, layerId, "line-width", mapConfig.contourWidth);
      }
    });
  } else {
    CONTOUR_LAYERS.forEach((layerId) => {
      setPaint(map, layerId, "line-opacity", 0);
    });
  }

  // Apply glow effect (using line-blur for glow simulation)
  if (mapConfig.glow && mapConfig.glowColor) {
    Object.values(ROAD_HIERARCHY).flat().forEach((layerId) => {
      // Add blur for glow effect
      setPaint(map, layerId, "line-blur", mapConfig.glowIntensity ? mapConfig.glowIntensity * 10 : 3);
    });
  }
}

// Darken a hex color by a factor (0-1)
function darkenColor(hex: string, factor: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.floor((num >> 16) * (1 - factor));
  const g = Math.floor(((num >> 8) & 0x00ff) * (1 - factor));
  const b = Math.floor((num & 0x0000ff) * (1 - factor));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// Legacy function for backwards compatibility
export function getPalette(styleId: string): Record<string, string> | null {
  const config = getStyleConfig(styleId);
  if (!config) return null;

  const roadColors = getRoadColors(config.map.roads);
  return {
    background: config.map.background || "#0e0e0e",
    roadColor: roadColors.primary, // Use primary as default for legacy compat
  };
}

// Legacy function
export function applyPaletteToMap(map: MapLibreMap, _palette: Record<string, string> | null): void {
  // This is now handled by applyStyleToMap
}

// Our custom label layer IDs
const CUSTOM_LABEL_LAYERS = ["place-labels", "road-labels"];

// Toggle labels visibility on the map
export function setLabelsVisibility(map: MapLibreMap, visible: boolean): void {
  const visibility = visible ? "visible" : "none";

  // Toggle our custom label layers
  CUSTOM_LABEL_LAYERS.forEach((layerId) => {
    try {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, "visibility", visibility);
      }
    } catch {
      // Layer might not exist in this style
    }
  });
}
