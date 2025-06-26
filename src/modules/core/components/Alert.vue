<template>
  <v-alert :type="type" border="start" variant="tonal" class="mt-4">
    {{ message }}
  </v-alert>
</template>

<script lang="ts" setup>
  // Define component props using Vue 3's script setup.
  // This component expects two props:
  // 1. 'type': A string that determines the visual style of the alert (e.g., 'success', 'info', 'warning', 'error').
  // 2. 'message': A string that contains the text content to be displayed within the alert.
  const { type, message } = defineProps<{type: string, message: string}>();
</script>