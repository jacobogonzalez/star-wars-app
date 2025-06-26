<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStarWarsApi, type StarWarsEntity } from '../composables/useStarWarsApi'
import DataTable from '../components/DataTable.vue'
import DataList from '../components/DataList.vue'
import DetailModal from '../components/DetailsModal.vue'
import HeaderWithViewToggle from '../components/HeaderWithViewToggle.vue'

// Defines the headers for the data table, including display title, data key, and sortability.
const headers = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Rotation Period', key: 'rotation_period', sortable: true },
  // { title: 'Orbital Period', key: 'orbital_period', sortable: true },
  { title: 'Diameter', key: 'diameter', sortable: true },
  { title: 'Climate', key: 'climate', sortable: true },
  // { title: 'Gravity', key: 'gravity', sortable: true },
  // { title: 'Terrain', key: 'terrain', sortable: true },
  // { title: 'Surface Water', key: 'surface_water', sortable: true },
  // { title: 'Population', key: 'population', sortable: true },
  { title: 'Creation Date', key: 'created', sortable: true },
]

// Utilizes the `useStarWarsApi` composable to handle data fetching and state management for 'planets'.
const {
  results, // Reactive reference to the fetched list of planets.
  loading, // Reactive boolean indicating if data is currently being loaded.
  error, // Reactive string holding any error message from the API.
  search, // Reactive string for the current search query.
  sortKey, // Reactive string for the current sorting key.
  sortAsc, // Reactive boolean indicating ascending sort order.
  selectedItem, // Reactive reference to the currently selected item for detailed view.
  loadingDetail, // Reactive boolean indicating if detail data is being loaded.
  errorDetail, // Reactive string holding any error message from detail fetching.
  fetchDetail, // Function to initiate fetching details for a specific item.
} = useStarWarsApi('planets') // Specifies the 'planets' endpoint for the Star Wars API.

// --- Modal Logic ---
const showDetailModal = ref(false) // Controls the visibility of the detail modal.

/**
 * Handles the click event on a table row or list item.
 * It fetches the details for the clicked item and then opens the detail modal.
 * @param item The StarWarsEntity object corresponding to the clicked row/item.
 */
function onRowClick(item: StarWarsEntity) {
  fetchDetail(extractIdFromUrl(item.url)) // Extracts the ID from the item's URL and fetches its details.
  showDetailModal.value = true // Sets the modal visibility to true.
}

/**
 * Extracts the numerical ID from a Star Wars API URL.
 * Example: "https://swapi.dev/api/planets/1/" would return "1".
 * @param url The full API URL of the entity.
 * @returns The extracted ID as a string.
 */
function extractIdFromUrl(url: string): string {
  const parts = url.split('/')
  // Returns the last non-empty segment of the URL, which typically contains the ID.
  return parts[parts.length - 1] || parts[parts.length - 2]
}

// --- View Mode Toggle ---
// Reactive reference to control the current view mode (either 'table' or 'list').
const viewMode = ref<'table' | 'list'>('table')

// --- Pagination Logic ---
const itemsPerPage = 10 // Defines the number of items to display per page.
const page = ref(1) // Reactive reference for the current page number.

/**
 * Computed property that returns a slice of `results.value` corresponding to the current page.
 * This ensures only the items for the active page are displayed.
 */
const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage // Calculates the starting index for the current page.
  return results.value.slice(start, start + itemsPerPage) // Slices the array to get the items for the current page.
})

/**
 * Computed property that calculates the total number of pages required based on the
 * total number of results and items per page.
 */
const pageCount = computed(() => Math.ceil(results.value.length / itemsPerPage))
</script>

<template>
  <div class="d-flex flex-column h-100 pa-4">
    <HeaderWithViewToggle title="Planets" :viewMode="viewMode" @update:viewMode="mode => viewMode = mode" />

    <v-alert v-if="error" type="error" prominent border="start" colored-border class="my-4" elevation="2"
      icon="mdi-alert-circle-outline">
      <strong>Error:</strong> {{ error }} </v-alert>

    <component :is="viewMode === 'table' ? DataTable : DataList" v-if="!error" :items="paginatedItems"
      :headers="headers" :loading="loading" :search="search" :sort-by="sortKey" :sort-desc="!sortAsc" :page="page"
      :page-count="pageCount" @update:page="(val: number) => page = val" @update:search="(val: string) => search = val"
      @update:sort-by="(key: string) => sortKey = key" @update:sort-desc="(desc: any) => sortAsc = !desc"
      @row-click="onRowClick" />

    <DetailModal v-model:modelValue="showDetailModal" :item="selectedItem" :loading="loadingDetail"
      :error="errorDetail" />
  </div>
</template>