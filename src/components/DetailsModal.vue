<script setup lang="ts">
import { computed } from 'vue';

// Defines the structure for a detail item, allowing for 'name', 'title', and any other properties.
interface DetailItem {
  name?: string;
  title?: string;
  [key: string]: any;
}

// Defines the props for the component.
interface Props {
  modelValue: boolean; // Controls the visibility of the dialog.
  item: DetailItem | null; // The item whose details are to be displayed.
  loading?: boolean; // Indicates if the details are currently being loaded.
  error?: string | null; // Stores any error message if loading fails.
}

// Sets up the component's props with default values.
const props = withDefaults(defineProps<Props>(), {
  loading: false, // Default loading state is false.
  error: null, // Default error state is null.
});

// Defines the events that this component can emit.
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void; // Emits when the dialog's visibility changes.
}>();

// A computed property that acts as a two-way binding for the dialog's visibility.
const dialogVisible = computed({
  // Getter returns the current modelValue prop.
  get: () => props.modelValue,
  // Setter emits an 'update:modelValue' event to update the parent's modelValue.
  set: (value) => emit('update:modelValue', value),
});

// A computed property that formats the item details for display.
const formattedDetails = computed(() => {
  // If no item is provided, return an empty object.
  if (!props.item) return {};

  const details: { [key: string]: any } = {};
  // Iterate over each key in the item.
  for (const key in props.item) {
    // Exclude specific keys that are either URLs, arrays of related resources, or redundant.
    if (
      ![
        'url',
        'films',
        'vehicles',
        'starships',
        'species',
        'homeworld',
        'residents',
        'pilots',
        'characters',
        'planets',
      ].includes(key)
    ) {
      let value = props.item[key];
      // Format the key: replace underscores with spaces and capitalize each word.
      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      // If the value is a string and looks like a URL, replace it with 'Linked resource'.
      if (typeof value === 'string' && value.startsWith('http')) {
        value = 'Linked resource';
      }
      details[formattedKey] = value;
    }
  }
  return details;
});

// Function to determine the appropriate Material Design icon for a given detail key.
function getIconForKey(key: string): string {
  // A mapping of formatted keys to their corresponding MDI icons.
  const icons: Record<string, string> = {
    Height: 'mdi-human-male-height',
    Mass: 'mdi-weight',
    Gender: 'mdi-human-male-female',
    'Birth Year': 'mdi-baby-face-outline',
    Climate: 'mdi-weather-partly-cloudy',
    Diameter: 'mdi-ruler-square',
    'Surface Water': 'mdi-water',
    Population: 'mdi-human-male',
    Terrain: 'mdi-land-fields',
    Gravity: 'mdi-arrow-collapse-vertical',
    'Rotation Period': 'mdi-rotate-orbit',
    'Orbital Period': 'mdi-orbit',
    Created: 'mdi-calendar-plus',
    Edited: 'mdi-calendar-edit',
    'Hair Color': 'mdi-palette',
    'Skin Color': 'mdi-palette-outline',
    'Eye Color': 'mdi-eye',
  };
  // Format the key to match the keys in the icons map.
  const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim();
  // Return the specific icon if found, otherwise return a generic information icon.
  return icons[formattedKey] || 'mdi-information-outline';
}
</script>

<template>
  <v-dialog v-model="dialogVisible" max-width="750" persistent>
    <v-card elevation="12" class="rounded-lg d-flex flex-column" style="height: 80vh; max-height: 80vh;">
      <v-card-title class="headline font-weight-bold d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-information-outline</v-icon>
        {{ props.item?.name || props.item?.title || 'Item Details' }}
        <v-spacer></v-spacer>
        <v-btn icon variant="text" @click="dialogVisible = false" aria-label="Close dialog">
          <v-icon color="grey darken-1">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6" style="flex: 1 1 auto; overflow-y: auto;">
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
          <p class="mt-4 subtitle-1 font-italic text--secondary">Loading details...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <v-icon large color="error" class="mb-2">mdi-alert-circle-outline</v-icon>
          <p class="subtitle-1 font-weight-medium" style="color: #b00020;">Error: {{ error }}</p>
        </div>

        <div v-else-if="!props.item" class="text-center py-8 text--secondary">
          <v-icon large class="mb-2">mdi-information-outline</v-icon>
          <p class="subtitle-1 font-weight-medium">No item selected or no details available.</p>
        </div>

        <v-container v-else fluid class="pa-0">
          <v-row dense>
            <v-col v-for="(value, key, index) in formattedDetails" :key="'detail-' + index" cols="12" sm="6" md="4">
              <v-card variant="text" rounded class="pa-4">
                <div class="d-flex align-center mb-2 text-primary" style="font-size: 0.9rem;">
                  <v-icon class="mr-2" size="18">{{ getIconForKey(key as string) }}</v-icon>
                  <span class="font-weight-bold">{{ key }}</span>
                </div>
                <div class="text-body-2" style="white-space: pre-wrap;">
                  {{ value }}
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="px-6 py-3">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="outlined" @click="dialogVisible = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>