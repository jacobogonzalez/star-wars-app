<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStarWarsApi, type StarWarsEntity } from '../composables/useStarWarsApi'
import DataTable from '../components/DataTable.vue'
import DataList from '../components/DataList.vue'
import DetailModal from '../components/DetailsModal.vue'
import HeaderWithViewToggle from '../components/HeaderWithViewToggle.vue'
import FilmCard from '../components/FilmCard.vue'

// Define the headers for the data table, including title, key, and sortable status.
const headers = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Gender', key: 'gender', sortable: true },
  { title: 'Height (cm)', key: 'height', sortable: true },
  { title: 'Weight (kg)', key: 'mass', sortable: true },
  { title: 'Creation Date', key: 'created', sortable: true },
]

// Use the useStarWarsApi composable to manage data fetching and state for 'people'.
const {
  results, // The array of fetched Star Wars entities.
  loading, // Boolean indicating if the main data is loading.
  error, // Any error message from the main data fetch.
  search, // Reactive search query.
  sortKey, // Reactive key for sorting.
  sortAsc, // Reactive boolean for ascending sort order.
  selectedItem, // The currently selected item for detail view.
  loadingDetail, // Boolean indicating if detail data is loading.
  errorDetail, // Any error message from detail fetch.
  fetchDetail, // Function to fetch details for a specific item.
} = useStarWarsApi('people') // Specify 'people' endpoint.

// --- Modal Logic ---
const showDetailModal = ref(false) // Controls the visibility of the detail modal.

/**
 * Handles a row click event, fetches the item's details, and opens the modal.
 * @param item The StarWarsEntity that was clicked.
 */
function onRowClick(item: StarWarsEntity) {
  fetchDetail(extractIdFromUrl(item.url)) // Fetch details using the ID extracted from the URL.
  showDetailModal.value = true // Show the detail modal.
}

/**
 * Extracts the ID from a Star Wars API URL.
 * Example: "https://swapi.dev/api/people/1/" -> "1"
 * @param url The URL of the Star Wars entity.
 * @returns The extracted ID as a string.
 */
function extractIdFromUrl(url: string): string {
  const parts = url.split('/')
  // Returns the last non-empty part of the URL, which should be the ID.
  return parts[parts.length - 1] || parts[parts.length - 2]
}

// --- View Mode Toggle ---
const viewMode = ref<'table' | 'list'>('table') // Reactive state for toggling between 'table' and 'list' views.

// --- Pagination Logic ---
const itemsPerPage = 10 // Number of items to display per page.
const page = ref(1) // Current page number.

// Computed property for items displayed on the current page.
const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return results.value.slice(start, start + itemsPerPage) // Slice the results array based on current page.
})

// Computed property for the total number of pages.
const pageCount = computed(() => Math.ceil(results.value.length / itemsPerPage))
</script>

<template>
  <div class="d-flex flex-column h-100 pa-4">
    <HeaderWithViewToggle title="People" :viewMode="viewMode" @update:viewMode="mode => viewMode = mode" />

    <v-alert v-if="error" type="error" prominent border="start" colored-border class="my-4" elevation="2"
      icon="mdi-alert-circle-outline">
      <strong>Error:</strong> {{ error }}
    </v-alert>
    <FilmCard class="mb-6"/>
    <component :is="viewMode === 'table' ? DataTable : DataList" v-if="!error" :items="paginatedItems"
      :headers="headers" :loading="loading" :search="search" :sort-by="sortKey" :sort-desc="!sortAsc" :page="page"
      :page-count="pageCount" @update:page="(val: number) => page = val" @update:search="(val: string) => search = val"
      @update:sort-by="(key: string) => sortKey = key" @update:sort-desc="(desc: any) => sortAsc = !desc"
      @row-click="onRowClick" />

    <DetailModal v-model:modelValue="showDetailModal" :item="selectedItem" :loading="loadingDetail"
      :error="errorDetail" />
  </div>
</template>