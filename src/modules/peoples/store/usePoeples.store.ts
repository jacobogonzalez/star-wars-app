import { defineStore } from "pinia";
import { ref } from "vue";
import { getPeoples } from "../api/peoplesService.api";
import { formatDate } from "../../core/utils/manageData.util"

/**
 * Defines the Pinia store for managing Star Wars peoples (characters) data.
 * The store is named 'peoplesStore'.
 */
export const usePeoplesStore = defineStore('peoplesStore', () => {
    // Reactive state: an array to hold the fetched peoples data.
    // It's initialized as an empty array.
    const peoples = ref<any>([]);

    /**
     * Asynchronously loads peoples data by calling the getPeoples API service.
     * The fetched data is then assigned to the 'peoples' ref.
     */
    async function loadPeoples() {
        const data = await getPeoples();

        peoples.value = data.map((person: any) => ({
            ...person,
            created: formatDate(person.created),
            edited: formatDate(person.edited),
        }));
    }

    // Expose the reactive state and actions that can be used by components.
    return {
        peoples,     // The reactive array of peoples
        loadPeoples, // The function to load peoples data
    };
});