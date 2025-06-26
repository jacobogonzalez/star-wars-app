import { defineStore } from "pinia";
import { ref } from "vue";
import { getFilms } from "../api/films.Service.api";

/**
 * Defines the Pinia store for managing planets data.
 * The store is named 'planetsStore'.
 */
export const useFilmsStore = defineStore('filmsStore', () => {
    // Reactive state: an array to hold the fetched planet data.
    // It's initialized as an empty array.
    const films = ref<any>([]);

    /**
     * Asynchronously loads planet data by calling the getPlanets API service.
     * The fetched data is then assigned to the 'planets' ref.
     */
    async function loadFilms() {
        films.value = await getFilms();
    }

    // Expose the reactive state and actions that can be used by components.
    return {
        films,     // The reactive array of planets
        loadFilms, // The function to load planets data
    };
});