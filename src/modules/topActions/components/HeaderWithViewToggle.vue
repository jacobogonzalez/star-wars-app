<template>
    <div class="d-flex justify-space-between align-center mb-4">
        <h1 class="text-h6 text-primary font-weight-bold">{{ title }}</h1>

        <div class="d-flex align-center" style="gap: 1rem;">
            <!-- Dark Mode Toggle Button -->
            <v-btn icon variant="text" @click="topActionsStore.toggleDarkMode"
                :aria-label="topActionsStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
                <!-- Tooltip displayed when hovering over the button -->
                <v-tooltip activator="parent" location="bottom">
                    {{ topActionsStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}
                </v-tooltip>

                <!-- Icon changes based on dark mode state -->
                <v-icon>
                    {{ topActionsStore.isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
                </v-icon>
            </v-btn>

            <!-- View Mode Toggle Button (Table <-> List) -->
            <v-btn data-testid="btn-grid-view" icon variant="text" @click="topActionsStore.toggleViewMode"
                :aria-label="topActionsStore.currentViewMode === 'table' ? 'Switch to List View' : 'Switch to Table View'">
                <!-- Tooltip shown on hover, describing the action -->
                <v-tooltip activator="parent" location="bottom">
                    {{ topActionsStore.currentViewMode === 'table' ? 'Switch to List View' : 'Switch to Table View' }}
                </v-tooltip>

                <!-- Icon changes based on the current view mode -->
                <v-icon>
                    {{ topActionsStore.currentViewMode === 'table' ? 'mdi-view-list' : 'mdi-table' }}
                </v-icon>
            </v-btn>
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import { useTopActionsStore } from '../store/useTopActions.store'

// Define the component's properties.
defineProps({
    title: { type: String, required: true },
})
// Initialize the top actions store
const topActionsStore = useTopActionsStore()
</script>
