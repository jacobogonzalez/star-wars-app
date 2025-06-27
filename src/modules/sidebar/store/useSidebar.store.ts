// stores/sidebarStore.ts (or wherever your store is defined)
import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * Defines the Pinia store for managing sidebar settings.
 * The store is named 'sidebarStore'.
 */
export const useSidebarStore = defineStore('sidebarStore', () => {
    // Reactive state: a boolean to hold the rail state of the sidebar.
    // It's initialized to false, meaning the sidebar is not in rail mode by default.
    const isRail = ref(false);

    // Action: a function to toggle the rail state.
    const toggleRail = () => {
        isRail.value = !isRail.value;
    };

    // Expose the reactive state and actions that can be used by components.
    return {
        isRail,       // The reactive rail state
        toggleRail,   // The action to toggle the rail state
    };
});