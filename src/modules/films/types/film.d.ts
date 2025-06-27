/**
 * Represents a Star Wars Film entity from the SWAPI.
 * Properties are defined based on the common JSON structure from SWAPI.
 */
interface Film {
  title: string;
  episode_id: number; // Episode number in the saga
  opening_crawl: string; // Opening text crawl shown at the beginning of the film
  director: string; // Director of the film
  producer: string; // Producers of the film, often a comma-separated string
  release_date: string; // Release date in ISO format (YYYY-MM-DD)
  characters: string[]; // Array of URLs to character entities
  planets: string[]; // Array of URLs to planet entities
  starships: string[]; // Array of URLs to starship entities
  vehicles: string[]; // Array of URLs to vehicle entities
  species: string[]; // Array of URLs to species entities
  created: string; // ISO 8601 date-time string when this resource was created
  edited: string; // ISO 8601 date-time string when this resource was last edited
  url: string; // URL to this film's detail resource
}

// Export the interface to be easily imported elsewhere
export type { Film };
