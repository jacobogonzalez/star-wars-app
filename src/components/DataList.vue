<script setup lang="ts">
import { ref, watch } from 'vue'

// Define the component's props with their types.
const props = defineProps<{
  items: any[] // Array of items to display.
  search: string // Current search query.
  loading: boolean // Loading state.
  sortBy: string // The field to sort by.
  sortDesc: boolean // Sorting direction (true for descending, false for ascending).
  page: number // Current page number for pagination.
  pageCount: number // Total number of pages for pagination.
}>()

// Define the events the component can emit to its parent.
const emit = defineEmits([
  'update:search', // Emits when the search query changes.
  'update:sortBy', // Emits when the sort-by field changes.
  'update:sortDesc', // Emits when the sort direction changes.
  'update:page', // Emits when the current page changes.
  'row-click', // Emits when an item card is clicked.
])

// --- Local state for inputs to allow for controlled updates (e.g., debouncing or combined logic) ---
const localSearch = ref(props.search) // Local ref for the search input.
const localSortBy = ref(props.sortBy) // Local ref for the sort-by field.
const localSortDesc = ref(props.sortDesc) // Local ref for the sort direction.
const localSortCombined = ref('name:asc') // Local ref for combined sort (field:direction).
const localPage = ref(props.page) // Local ref for the current page.

// --- Watchers to synchronize local state with props and emit updates to the parent ---

// Watch for changes in localPage and emit 'update:page' to the parent.
watch(localPage, val => emit('update:page', val))
// Watch for changes in the props.page and update localPage accordingly (for external changes).
watch(() => props.page, val => localPage.value = val)

// Watch for changes in localSortCombined (e.g., from the combined sort select).
watch(localSortCombined, val => {
  // Split the combined value (e.g., 'name:asc') into sortBy and sortDir.
  const [sortBy, sortDir] = val.split(':')
  // Emit updates for sortBy and sortDesc to the parent.
  emit('update:sortBy', sortBy)
  emit('update:sortDesc', sortDir === 'desc')
})

// Watch for changes in localSearch and emit 'update:search' to the parent.
watch(localSearch, val => emit('update:search', val))
// These watchers might become redundant if localSortCombined is the primary control for sorting.
// They are kept here in case individual sortBy/sortDesc updates are needed from other sources.
watch(localSortBy, val => emit('update:sortBy', val))
watch(localSortDesc, val => emit('update:sortDesc', val))

// Visible sorting options for the v-select component.
const combinedSortOptions = [
  { title: 'Name Ascending', value: 'name:asc' },
  { title: 'Name Descending', value: 'name:desc' },
  { title: 'Date Ascending', value: 'created:asc' },
  { title: 'Date Descending', value: 'created:desc' },
];
</script>

<template>
  <v-card width="100%" height="500px">
    <v-card-text>
      <div>
        <div class="d-flex align-center justify-end mb-4" style="gap: 0.5rem; flex-wrap: wrap;">
          <v-select v-model="localSortCombined" :items="combinedSortOptions" label="Sort by" hide-details dense
            style="max-width: 250px;" variant="outlined" density="compact" />

          <v-text-field v-model="localSearch" label="Search..." single-line hide-details variant="outlined" dense
            style="max-width: 250px;" append-inner-icon="mdi-magnify" density="compact" />
        </div>

        <div>
          <v-skeleton-loader v-if="loading" type="card@5" class="mb-4" />

          <v-row v-else dense class="containerCards">
            <v-col v-for="item in items" :key="item.name" cols="12" sm="6" md="4">
              <v-card class="ma-2" variant="outlined" @click="$emit('row-click', item)" style="cursor: pointer;">
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
            </v-col>
          </v-row>

          <v-alert v-if="!loading && items.length === 0" type="info" border="start" variant="tonal" class="mt-4">
            No results found.
          </v-alert>

          <v-pagination v-if="pageCount > 1" v-model="localPage" :length="pageCount" density="compact"
            active-color="primary" rounded="circle" class="mt-4 align-self-center" />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
/* Scoped styles for the component */
.containerCards {
  max-height: 380px; /* Limits the height of the cards container */
  overflow: auto; /* Enables scrolling if content exceeds max-height */
}
</style>