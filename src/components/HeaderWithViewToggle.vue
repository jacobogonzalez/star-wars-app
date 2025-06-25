<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { useTheme } from 'vuetify'

const props = defineProps({
  title: { type: String, required: true },
  viewMode: {
    type: String as () => 'table' | 'list',
    required: true,
  },
})

const emits = defineEmits(['update:viewMode'])

function toggleViewMode() {
  emits('update:viewMode', props.viewMode === 'table' ? 'list' : 'table')
}

// Dark mode logic
const theme = useTheme()
const isDark = computed({
  get: () => theme.global.current.value.dark,
  set: (val) => (theme.global.name.value = val ? 'dark' : 'light'),
})
function toggleDarkMode() {
  isDark.value = !isDark.value
}
</script>

<template>
  <div class="d-flex justify-space-between align-center mb-4">
    <!-- Título -->
    <h1 class="text-h5 font-weight-bold">{{ title }}</h1>

    <!-- Controles -->
    <div class="d-flex align-center" style="gap: 1rem;">
         <v-btn
        icon
        variant="text"
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        @click="toggleDarkMode"
      >
        <v-icon>
          {{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
        </v-icon>
      </v-btn>
      <!-- Toggle vista -->
      <v-btn
        icon
        variant="text"
        :title="viewMode === 'table' ? 'Cambiar a lista' : 'Cambiar a tabla'"
        @click="toggleViewMode"
      >
        <v-icon>{{ viewMode === 'table' ? 'mdi-view-list' : 'mdi-table' }}</v-icon>
      </v-btn>

    </div>
  </div>
</template>
