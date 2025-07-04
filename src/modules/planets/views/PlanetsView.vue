<template>
  <div class="d-flex flex-column h-100 pa-4">
    <HeaderWithViewToggle title="planets" />
    <v-card v-if="error" height="100px" class="mb-2">
      <Alert :message="`Error: ${error}`" type="error" />
    </v-card>


    <FilmCard class="mb-6" />
    <!--
      NOTE:
      While the most optimal approach would be to handle sorting, searching, and loading logic
      **inside the component itself** (e.g., DataTable or GridData) and simply pass the final data as props—
      possibly using a state management tool like Pinia for shared state—
      this implementation is structured this way **intentionally** to demonstrate
      how to handle event communication between parent and child components (and vice versa).
    -->
    <component :is="topActionsStore.currentViewMode === 'table' ? DataTable : GridData" :items="preparedData"
      :headers="headers" :loading="isLoading" :search="search" :sort-by="sortKey" :sort-desc="!sortAsc"
      @update:search="(val: string) => search = val" @update:sort-by="(key: string) => sortKey = key"
      @update:sort-desc="(desc: boolean) => sortAsc = !desc" @row-click="onRowClick" />

    <DetailModal v-model:modelValue="showDetailModal" :item="selectedItem" :loading="loadingDetail"
      :error="errorDetail" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

// --- Component Imports ---
import DataTable from '../../../modules/dataTable/components/DataTable.vue';

import DetailModal from '../../modals/components/DetailsModal.vue';
import HeaderWithViewToggle from '../../topActions/components/HeaderWithViewToggle.vue';
import FilmCard from '../../../modules/films/components/FilmCard.vue';
import GridData from '../../../modules/dataGrid/components/GridData.vue';
import Alert from "../../../modules/core/components/Alert.vue"
import type { Planet } from '../types/planet';

// --- Store Imports ---
import { usePlanetsStore } from '../../../modules/planets/store/usePlanets.store.ts';
import { useTopActionsStore } from '../../../modules/topActions/store/useTopActions.store.ts';
// --- Utility Imports ---
import { applyFiltersAndSort, extractIdFromUrl } from '../../../modules/core/utils/manageData.util.ts';

// --- Store Initialization ---
const planetsStore = usePlanetsStore();
const topActionsStore = useTopActionsStore();

// Data fetching and loading states
const isLoading = ref(false); // Indicates if main people data is being loaded
const loadingDetail = ref(false); // Indicates if detail data for modal is being processed

// Error states
const error = ref<string | null>(null); // General error for main data loading
const errorDetail = ref<string | null>(null); // Specific error for detail modal content

// Search and sorting states
const search = ref(''); // Current search query
const sortKey = ref(''); // Key for current sorting
const sortAsc = ref<boolean>(true); // Sort order (true for ascending)

// Data for display
const preparedData = ref<any>([]); // Data after filters and sorting applied
const selectedItem = ref<Planet | null>(null); // Item selected for the detail modal

// --- Component Data ---

// Defines the headers for the data table, including display title, data key, and sortability.
const headers = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Rotation Period', key: 'rotation_period', sortable: true },
  { title: 'Diameter', key: 'diameter', sortable: true },
  { title: 'Climate', key: 'climate', sortable: true },
  { title: 'Creation Date', key: 'created', sortable: true },
]

// --- Modal Logic ---

// Controls the visibility of the detail modal.
const showDetailModal = ref(false);

/**
 * Handles the click event on a table row or list item.
 * Extracts the item's ID, finds the corresponding item in the store,
 * and then opens the detail modal with the selected item's data.
 * @param item The Planet object corresponding to the clicked row/item.
 */
function onRowClick(item: Planet) {
  loadingDetail.value = true; // Set loading state for detail modal
  errorDetail.value = null; // Clear any previous detail error
  showDetailModal.value = true; // Open the modal

  try {
    const itemId = extractIdFromUrl(item.url); // Extract ID from the item's URL
    // Find the item in the store's planets array based on its ID
    selectedItem.value = planetsStore.planets.find((p: { url: string; }) => extractIdFromUrl(p.url) === itemId) || null;

    if (!selectedItem.value) {
      // If the item isn't found, set an error message
      errorDetail.value = 'Selected item not found in store. Please try again.';
    }
  } catch (err) {
    // Catch any errors during the item retrieval process
    console.error('Error finding item in store:', err);
    errorDetail.value = 'Failed to retrieve item details due to an unexpected error.';
  } finally {
    loadingDetail.value = false; // Reset loading state
  }
}

// --- Watchers for Data Filtering and Sorting ---

/**
 * Watches for changes in the search query and re-applies filters and sorting.
 */
watch(search, (newSearch) => {
  preparedData.value = applyFiltersAndSort({
    data: planetsStore.planets,
    elementToSearch: newSearch,
    sortKey: sortKey.value,
    sortAsc: sortAsc.value,
  });
}, { immediate: true }); // immediate: true ensures it runs once on component mount

/**
 * Watches for changes in the sort key and re-applies filters and sorting.
 */
watch(sortKey, (newSortKey) => {
  preparedData.value = applyFiltersAndSort({
    data: planetsStore.planets,
    elementToSearch: search.value,
    sortKey: newSortKey,
    sortAsc: sortAsc.value,
  });
}, { immediate: true });

/**
 * Watches for changes in the sort order and re-applies filters and sorting.
 */
watch(sortAsc, (newSortAsc) => {
  preparedData.value = applyFiltersAndSort({
    data: planetsStore.planets,
    elementToSearch: search.value,
    sortKey: sortKey.value,
    sortAsc: newSortAsc,
  });
}, { immediate: true });

// --- Lifecycle Hooks ---

/**
 * On component mount, loads the planets data from the store
 * and initializes the preparedData. Handles loading and error states.
 */
onMounted(async () => {
  try {
    isLoading.value = true; // Set loading state to true
    error.value = null; // Clear any previous general error

    // Attempt to load planets data from the store
    await planetsStore.loadPlanets();

    // After loading, apply initial filters and sorting
    preparedData.value = applyFiltersAndSort({
      data: planetsStore.planets,
      elementToSearch: search.value,
      sortKey: sortKey.value,
      sortAsc: sortAsc.value,
    });
  } catch (err: any) {
    // Catch and handle any errors during data loading
    console.error('Error loading planets:', err);
    error.value = err.message || 'Failed to load planets data. Please try again later.';
  } finally {
    isLoading.value = false; // Reset loading state
  }
});
</script>