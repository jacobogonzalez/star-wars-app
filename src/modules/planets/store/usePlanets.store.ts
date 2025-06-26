import { defineStore } from "pinia";
import { ref } from "vue";
import { getPlanets } from "../api/planetsService.api";

/**
 * Defines the Pinia store for managing planets data.
 * The store is named 'planetsStore'.
 */
export const usePlanetsStore = defineStore('planetsStore', () => {
    // Reactive state: an array to hold the fetched planet data.
    // It's initialized as an empty array.
    const planets = ref<any>([]);

    /**
     * Asynchronously loads planet data by calling the getPlanets API service.
     * The fetched data is then assigned to the 'planets' ref.
     */
    async function loadPlanets() {
        planets.value = await getPlanets();
    }

    // Expose the reactive state and actions that can be used by components.
    return {
        planets,     // The reactive array of planets
        loadPlanets, // The function to load planets data
    };
});