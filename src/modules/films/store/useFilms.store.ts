import { defineStore } from "pinia";
import { ref } from "vue";
import { getFilms } from "../api/films.Service.api";

/**
 * Defines the Pinia store for managing filsm data.
 * The store is named 'filmsStore'.
 */
export const useFilmsStore = defineStore('filmsStore', () => {
    // Reactive state: an array to hold the fetched films data.
    // It's initialized as an empty array.
    const films = ref<any>([]);

    /**
     * Asynchronously loads planet data by calling the getfilms API service.
     * The fetched data is then assigned to the 'films' ref.
     */
    async function loadFilms() {
        films.value = await getFilms();
    }

    // Expose the reactive state and actions that can be used by components.
    return {
        films,     // The reactive array of films
        loadFilms, // The function to load films data
    };
});