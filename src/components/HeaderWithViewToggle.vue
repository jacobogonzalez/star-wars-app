<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

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
</script>

<template>
  <div class="d-flex justify-space-between align-center mb-4">
    <h1 class="text-h5 font-weight-bold">{{ title }}</h1>
    <v-btn
      icon
      variant="text"
      :title="viewMode === 'table' ? 'Cambiar a lista' : 'Cambiar a tabla'"
      @click="toggleViewMode"
    >
      <v-icon>{{ viewMode === 'table' ? 'mdi-view-list' : 'mdi-table' }}</v-icon>
    </v-btn>
  </div>
</template>
