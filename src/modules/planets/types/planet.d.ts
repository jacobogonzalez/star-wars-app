// src/modules/planets/types/planet.d.ts

/**
 * Represents a Star Wars Planet entity from the SWAPI.
 * Properties are defined based on the provided JSON structure.
 */
interface Planet {
  name: string;
  rotation_period: string; // Can be a number or "unknown"
  orbital_period: string;  // Can be a number or "unknown"
  diameter: string;        // Can be a number or "unknown"
  climate: string;
  gravity: string;         // Can be a number (e.g., "1 standard", "0.9") or "unknown"
  terrain: string;
  surface_water: string;   // Can be a number or "unknown"
  population: string;      // Can be a number or "unknown"
  residents: string[];     // Array of URLs to resident entities
  films: string[];         // Array of URLs to film entities
  created: string;         // ISO 8601 date-time string
  edited: string;          // ISO 8601 date-time string
  url: string;             // URL to this planet's detail
}

// Export the interface to be easily imported elsewhere
export type { Planet };