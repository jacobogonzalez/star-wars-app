<template>
  <div>
    <v-card v-if="isLoading" color="#1F7087" max-height="150px">
      <v-skeleton-loader  type="card"></v-skeleton-loader>
    </v-card>

    <v-card v-if="error" height="100px" class="mb-2">
      <Alert message="Error Loading Film" type="error" />
    </v-card>

    <v-card v-if="randomFilm">
      <v-row>
        <v-col cols="12" sm="4" md="3" class="d-flex flex-column justify-center align-center pa-2">
          <v-img :src="getPosterUrl(randomFilm.title)" cover width="100%" max-height="150" class="rounded-lg"></v-img>
        </v-col>

        <v-col cols="12" sm="8" md="9">
          <div>
            <v-card-title class="text-primary">
              {{ randomFilm.title }}
            </v-card-title>

            <v-card-subtitle>
              Episode {{ randomFilm.episode_id }}
            </v-card-subtitle>

            <v-card-text class="text-caption">
              {{ randomFilm.opening_crawl }}
            </v-card-text>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-alert v-else type="info" title="No Film Data" text="No Star Wars film data is available to display."
      variant="tonal" class="text-center"></v-alert>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Film } from '../types/film';
// --- Store Imports ---
import { useFilmsStore } from '../../../modules/films/store/useFilms.store.ts';
import Alert from "../../../modules/core/components/Alert.vue"

// --- Store Initialization ---
const filmsStore = useFilmsStore();

// --- Reactive State Declarations ---

// Stores the randomly selected film to be displayed.
const randomFilm = ref<Film | null>(null);
// Indicates if the film data is currently being loaded.
const isLoading = ref(true); // Renamed from isLoadingFilm for consistency with 'error'
// Stores any error message encountered during film loading.
const error = ref<string | null>(null); // Renamed from filmError for consistency

// --- Data for Film Posters ---

// A map linking film titles to their corresponding poster image URLs.
const filmPosterMap: Record<string, string> = {
  "A New Hope": "/images/star-wars-posters/a-new-hope.jpeg",
  "The Empire Strikes Back": "/images/star-wars-posters/empire-strikes-back.jpg",
  "Return of the Jedi": "/images/star-wars-posters/return-of-the-jedi.jpg",
  "The Phantom Menace": "/images/star-wars-posters/phantom-menace.jpg",
  "Attack of the Clones": "/images/star-wars-posters/attack-of-the-clones.jpg",
  "Revenge of the Sith": "/images/star-wars-posters/revenge-of-the-sith.jpg",
};

// --- Utility Functions ---

/**
 * Returns the appropriate poster URL for a given film title.
 * Provides a fallback default image if no specific poster is found.
 * @param filmTitle The title of the film.
 * @returns The URL of the film poster image.
 */
function getPosterUrl(filmTitle: string | undefined): string {
  if (filmTitle && filmPosterMap[filmTitle]) {
    return filmPosterMap[filmTitle];
  }
  // Fallback image in case no specific poster is found
  return '/images/star-wars-posters/default-star-wars-poster.jpg'; // Ensure this default image exists.
}

/**
 * Selects a random film from the fetched list of films available in the store.
 * Updates `randomFilm` and adjusts loading/error states accordingly.
 */
function selectRandomFilm() {
  const films = filmsStore.films; // Access the films array from the Pinia store.
  if (films && films.length > 0) {
    const randomIndex = Math.floor(Math.random() * films.length);
    randomFilm.value = films[randomIndex];
  } else if (!isLoading.value && !error.value) {
    // If no films are found and we're not currently loading or have a general error,
    // set a specific error message for the film card.
    error.value = 'No Star Wars films found to display.';
  }
}

// --- Lifecycle Hooks ---

/**
 * On component mount, loads the films data from the store
 * and then selects a random film to display.
 * Handles loading and error states for the film card.
 */
onMounted(async () => {
  try {
    isLoading.value = true; // Set loading state to true for the card.
    error.value = null; // Clear any previous error messages.

    // Attempt to load film data from the store.
    await filmsStore.loadFilms();

    // After successfully loading films, select one at random.
    selectRandomFilm();
  } catch (err: any) {
    // Catch and handle any errors that occur during data loading.
    console.error('Error loading films:', err);
    error.value = err.message || 'Failed to load Star Wars film data. Please try again later.';
  } finally {
    isLoading.value = false; // Reset loading state regardless of success or failure.
  }
});
</script>


<style scoped>
/* Scoped styles can be added here if needed for this component only. */
/* Currently, no specific styles are defined in this section. */
</style>