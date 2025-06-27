<template>
    <div class="d-flex justify-space-between align-center mb-4">
        <h1 class="text-h6 text-primary font-weight-bold">{{ title }}</h1>

        <div class="d-flex align-center" style="gap: 1rem;">
            <v-btn icon variant="text" :title="topActionsStore.isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'"
                @click="topActionsStore.toggleDarkMode">
                <v-icon>
                    {{ topActionsStore.isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
                </v-icon>
            </v-btn>

            <v-btn icon variant="text" :title="topActionsStore.currentViewMode === 'table' ? 'Cambiar a Vista de Lista' : 'Cambiar a Vista de Tabla'"
                @click="topActionsStore.toggleViewMode">
                <v-icon>{{ topActionsStore.currentViewMode === 'table' ? 'mdi-view-list' : 'mdi-table' }}</v-icon>
            </v-btn>
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import { useTopActionsStore } from '../store/useTopActions.store' 

// Define the component's properties.
const props = defineProps({
    title: { type: String, required: true }, // The title to display in the header.
})

// Initialize the top actions store
const topActionsStore = useTopActionsStore()
</script>

