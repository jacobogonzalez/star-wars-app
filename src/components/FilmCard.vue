<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useStarWarsApi, type StarWarsEntity } from '../composables/useStarWarsApi'; // Make sure your path is correct

// Use the composable to fetch films
const {
  results: films,
  loading: filmsLoading,
  error: filmsError,
} = useStarWarsApi('films');

const randomFilm = ref<StarWarsEntity | null>(null);
const isLoadingFilm = ref(true); // Internal loading state for the card component
const filmError = ref<string | null>(null); // Internal error state for the card component

const filmPosterMap: Record<string, string> = {
  "A New Hope": "/images/star-wars-posters/a-new-hope.jpeg",
  "The Empire Strikes Back": "/images/star-wars-posters/empire-strikes-back.jpg",
  "Return of the Jedi": "/images/star-wars-posters/return-of-the-jedi.jpg",
  "The Phantom Menace": "/images/star-wars-posters/phantom-menace.jpg",
  "Attack of the Clones": "/images/star-wars-posters/attack-of-the-clones.jpg",
  "Revenge of the Sith": "/images/star-wars-posters/revenge-of-the-sith.jpg",
};

function getPosterUrl(filmTitle: string | undefined): string {
  if (filmTitle && filmPosterMap[filmTitle]) {
    return filmPosterMap[filmTitle];
  }
  // Fallback image in case no specific poster is found
  return '/images/star-wars-posters/default-star-wars-poster.jpg'; // Make sure you have a default image too!
}
/**
 * Selects a random film from the fetched list of films.
 */
function selectRandomFilm() {
  if (films.value && films.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * films.value.length);
    randomFilm.value = films.value[randomIndex];
    isLoadingFilm.value = false;
  } else if (!filmsLoading.value && !filmsError.value) {
    // If no films are found and we're not loading or have an error
    filmError.value = 'No Star Wars films found to display.';
    isLoadingFilm.value = false;
  }
}

// Watch for changes in the films data. If films are loaded, select one at random.
watch(films, (newFilms) => {
  if (newFilms.length > 0) {
    selectRandomFilm();
  }
}, { immediate: true }); // immediate: true ensures it runs once on component mount

// Also watch for errors from the parent composable
watch(filmsError, (newError) => {
    if (newError) {
        filmError.value = `Failed to load films: ${newError}`;
        isLoadingFilm.value = false;
    }
});

// On mount, if no films are loaded yet, try to select a random film (might be redundant with watch, but good for robustness)
onMounted(() => {
  if (films.value.length === 0 && !filmsLoading.value && !filmsError.value) {
    selectRandomFilm();
  }
});
</script>

<template>
    <div>
      <v-card
        v-if="isLoadingFilm || filmsLoading"
        color="#1F7087"
      >
        <v-skeleton-loader
          type="card"
        ></v-skeleton-loader>
      </v-card>

      <v-alert
        v-else-if="filmError"
        type="error"
        title="Error Loading Film"
        :text="filmError"
        variant="tonal"
        class="text-center"
      ></v-alert>

      <v-card
        v-else-if="randomFilm"
      >
        <div class="d-flex flex-no-wrap justify-space-between align-center">
          <v-avatar
            class="ma-3"
            rounded="0"
            size="250"
          >
            <v-img :src="getPosterUrl(randomFilm.title)"></v-img>
          </v-avatar>
          <div>
            <v-card-title >
              {{ randomFilm.title }}
            </v-card-title>

            <v-card-subtitle >
              Episode {{ randomFilm.episode_id }}
            </v-card-subtitle>

            <v-card-text class="text-caption ">
              {{ randomFilm.opening_crawl }}
            </v-card-text>
          </div>
        </div>
      </v-card>

      <v-alert
        v-else
        type="info"
        title="No Film Data"
        text="No Star Wars film data is available."
        variant="tonal"
        class="text-center"
      ></v-alert>
    </div>
</template>

<style scoped>
/* All scoped styles have been removed as per your request */
</style>