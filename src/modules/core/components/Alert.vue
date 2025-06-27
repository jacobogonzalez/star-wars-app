<template>
  <v-alert :type="type" border="start" variant="tonal" class="mt-4">
    {{ message }}
  </v-alert>
</template>

<script lang="ts" setup>
interface Props {
  type: 'error' | 'info' | 'success' | 'warning';
  message: string;
}

// Destructure the props directly from defineProps
const { type, message } = defineProps<Props>();
</script>