<template>
  <v-card class="ma-2" variant="outlined" style="cursor: pointer;">
    <v-card-title class="pb-0">
      {{ item.name }}
    </v-card-title>
    <v-card-subtitle>
      {{ item.created }}
    </v-card-subtitle>
    <v-card-text>
      <v-row dense>
        <template v-if="'diameter' in item">
          <v-col cols="12">
            <v-icon size="18" class="mr-1" color="primary">mdi-earth</v-icon>
            <strong>Climate:</strong> {{ item.climate }}
          </v-col>
          <v-col cols="12">
            <v-icon size="18" class="mr-1" color="primary">mdi-ruler-square</v-icon>
            <strong>Diameter:</strong> {{ item.diameter }} km
          </v-col>
          <v-col cols="12">
            <v-icon size="18" class="mr-1" color="primary">mdi-movie-open</v-icon>
            <strong>Films:</strong> {{ item.films.length }}
          </v-col>
        </template>

        <template v-else>
          <v-col cols="12">
            <v-icon size="18" class="mr-1" color="primary">mdi-human-male-female</v-icon>
            <strong>Gender:</strong> {{ item.gender }}
          </v-col>
          <v-col cols="12">
            <v-icon size="18" class="mr-1" color="primary">mdi-human-male-height</v-icon>
            <strong>Height:</strong> {{ item.height }} cm
          </v-col>
          <v-col cols="12">
            <v-icon size="18" class="mr-1" color="primary">mdi-movie-open</v-icon>
            <strong>Films:</strong> {{ item.films.length }}
          </v-col>
        </template>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  // Define component props using Vue 3's script setup.
  // This component expects an 'item' prop, which can be of any type
  // (though it's implicitly expected to be either a Planet or Person object).
  const { item } = defineProps<{item: any}>();
</script>