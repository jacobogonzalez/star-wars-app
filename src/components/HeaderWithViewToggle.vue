<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { useTheme } from 'vuetify'

// Define the component's properties.
const props = defineProps({
    title: { type: String, required: true }, // The title to display in the header.
    viewMode: {
        type: String as () => 'table' | 'list', // The current view mode, either 'table' or 'list'.
        required: true,
    },
})

// Define the custom events the component can emit.
const emits = defineEmits(['update:viewMode'])

/**
 * Toggles the view mode between 'table' and 'list' and emits the updated mode.
 */
function toggleViewMode() {
    emits('update:viewMode', props.viewMode === 'table' ? 'list' : 'table')
}

// --- Dark mode logic ---
// Access the Vuetify theme composable.
const theme = useTheme()

// Computed property to get and set the global dark mode state.
const isDark = computed({
    get: () => theme.global.current.value.dark, // Returns true if the current theme is dark.
    set: (val) => (theme.global.name.value = val ? 'dark' : 'light'), // Sets the theme to 'dark' or 'light'.
})

/**
 * Toggles the dark mode on or off.
 */
function toggleDarkMode() {
    isDark.value = !isDark.value
}
</script>

<template>
    <div class="d-flex justify-space-between align-center mb-4">
        <h1 class="text-h6 font-weight-bold">{{ title }}</h1>

        <div class="d-flex align-center" style="gap: 1rem;">
            <v-btn icon variant="text" :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
                @click="toggleDarkMode">
                <v-icon>
                    {{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }} </v-icon>
            </v-btn>

            <v-btn icon variant="text" :title="viewMode === 'table' ? 'Switch to List View' : 'Switch to Table View'"
                @click="toggleViewMode">
                <v-icon>{{ viewMode === 'table' ? 'mdi-view-list' : 'mdi-table' }}</v-icon> </v-btn>
        </div>
    </div>
</template>