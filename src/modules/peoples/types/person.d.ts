/**
 * Represents a Star Wars People (Character) entity from the SWAPI.
 * Properties are defined based on the common JSON structure from SWAPI.
 */
interface Person {
  name: string;
  height: string; // Can be a number or "unknown"
  mass: string;   // Can be a number or "unknown"
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string; // Often a string like "19BBY" or "unknown"
  gender: string;
  homeworld: string; // URL to the homeworld planet
  films: string[];   // Array of URLs to film entities
  species: string[]; // Array of URLs to species entities
  vehicles: string[]; // Array of URLs to vehicle entities
  starships: string[]; // Array of URLs to starship entities
  created: string;   // ISO 8601 date-time string
  edited: string;    // ISO 8601 date-time string
  url: string;       // URL to this person's detail
}

// Export the interface to be easily imported elsewhere
export type { Person };