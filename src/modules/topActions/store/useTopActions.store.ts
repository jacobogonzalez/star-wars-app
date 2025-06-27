// stores/topActionsStore.ts
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useTheme } from 'vuetify';

export const useTopActionsStore = defineStore('topActionsStore', () => {
    // Vuetify theme instance
    const vuetifyTheme = useTheme();

    // --- State for Dark Mode ---
    // Initialize based on current Vuetify theme or a sensible default
    const isDark = ref(vuetifyTheme.global.current.value.dark);

    // Watch for changes in isDark and update Vuetify theme accordingly
    watch(isDark, (newValue) => {
        vuetifyTheme.global.name.value = newValue ? 'dark' : 'light';
    }, { immediate: true }); // 'immediate' ensures the watcher runs on store initialization

    /**
     * Toggles the dark mode state.
     */
    const toggleDarkMode = () => {
        isDark.value = !isDark.value;
    };

    // --- State for View Mode ---
    // 'table' | 'list' - default to 'table'
    const currentViewMode = ref<'table' | 'list'>('table');

    /**
     * Toggles the view mode between 'table' and 'list'.
     */
    const toggleViewMode = () => {
        currentViewMode.value = currentViewMode.value === 'table' ? 'list' : 'table';
    };

    return {
        isDark,
        toggleDarkMode,
        currentViewMode,
        toggleViewMode,
    };
});