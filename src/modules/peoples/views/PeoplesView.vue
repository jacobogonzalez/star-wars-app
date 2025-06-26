<template>
  <div class="d-flex flex-column h-100 pa-4">
    <HeaderWithViewToggle
      title="Peoples"
      :viewMode="viewMode"
      @update:viewMode="mode => viewMode = mode"
    />
    <v-card v-if="error "height="100px">
      <Alert  :message="`Error: ${error}`" type="error" />
    </v-card>


    <FilmCard class="mb-6" />

    <component
      :is="viewMode === 'table' ? DataTable : GridData"
      :items="preparedData"
      :headers="headers"
      :loading="isLoading"
      :search="search"
      :sort-by="sortKey"
      :sort-desc="!sortAsc"
      @update:search="(val: string) => search = val"
      @update:sort-by="(key: string) => sortKey = key"
      @update:sort-desc="(desc: any) => sortAsc = !desc"
      @row-click="onRowClick"
    />

    <DetailModal
      v-model:modelValue="showDetailModal"
      :item="selectedItem"
      :loading="loadingDetail"
      :error="errorDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

// --- Component Imports ---
import DataTable from '../../../modules/dataTable/components/DataTable.vue';
// DataList is not currently used but kept for context if needed later.
// import DataList from '../../../components/DataList.vue';
import DetailModal from '../../../components/DetailsModal.vue';
import HeaderWithViewToggle from '../../../components/HeaderWithViewToggle.vue';
import FilmCard from '../../../modules/films/components/FilmCard.vue';
import GridData from '../../../modules/dataGrid/components/GridData.vue';
import Alert from "../../../modules/core/components/Alert.vue"

// --- Store Imports ---
import { usePeoplesStore } from '../../../modules/peoples/store/usePoeples.store.ts';

// --- Utility Imports ---
import { applyFiltersAndSort, extractIdFromUrl } from '../../../modules/core/utils/manageData.util.ts';

// --- Store Initialization ---
const peoplesStore = usePeoplesStore();

// --- Reactive State Declarations ---

// View mode control ('table' or 'list')
const viewMode = ref<'table' | 'list'>('table');

// Data fetching and loading states
const isLoading = ref(false); // Indicates if main people data is being loaded
const loadingDetail = ref(false); // Indicates if detail data for modal is being processed

// Error states
const error = ref<string | null>(null); // General error for main data loading
const errorDetail = ref<string | null>(null); // Specific error for detail modal content

// Search and sorting states
const search = ref(''); // Current search query
const sortKey = ref(''); // Key for current sorting
const sortAsc = ref(''); // Sort order (true for ascending)

// Data for display
const preparedData = ref<any>([]); // Data after filters and sorting applied
const selectedItem = ref<StarWarsEntity | null>(null); // Item selected for the detail modal

// --- Component Data ---

// Defines the headers for the data table, including display title, data key, and sortability.
const headers = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Gender', key: 'gender', sortable: true },
  { title: 'Height (cm)', key: 'height', sortable: true },
  { title: 'Weight (kg)', key: 'mass', sortable: true },
  { title: 'Creation Date', key: 'created', sortable: true },
];

// --- Modal Logic ---

// Controls the visibility of the detail modal.
const showDetailModal = ref(false);

/**
 * Handles the click event on a table row or list item.
 * Extracts the item's ID, finds the corresponding item in the store,
 * and then opens the detail modal with the selected item's data.
 * @param item The StarWarsEntity object corresponding to the clicked row/item.
 */
function onRowClick(item: StarWarsEntity) {
  loadingDetail.value = true; // Set loading state for detail modal
  errorDetail.value = null; // Clear any previous detail error
  showDetailModal.value = true; // Open the modal

  try {
    const itemId = extractIdFromUrl(item.url); // Extract ID from the item's URL
    // Find the item in the store's peoples array based on its ID
    selectedItem.value = peoplesStore.peoples.find(p => extractIdFromUrl(p.url) === itemId) || null;

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
    data: peoplesStore.peoples,
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
    data: peoplesStore.peoples,
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
    data: peoplesStore.peoples,
    elementToSearch: search.value,
    sortKey: sortKey.value,
    sortAsc: newSortAsc,
  });
}, { immediate: true });

// --- Lifecycle Hooks ---

/**
 * On component mount, loads the peoples data from the store
 * and initializes the preparedData. Handles loading and error states.
 */
onMounted(async () => {
  try {
    isLoading.value = true; // Set loading state to true
    error.value = null; // Clear any previous general error

    // Attempt to load peoples data from the store
    await peoplesStore.loadPeoples();

    // After loading, apply initial filters and sorting
    preparedData.value = applyFiltersAndSort({
      data: peoplesStore.peoples,
      elementToSearch: search.value,
      sortKey: sortKey.value,
      sortAsc: sortAsc.value,
    });
  } catch (err: any) {
    // Catch and handle any errors during data loading
    console.error('Error loading peoples:', err);
    error.value = err.message || 'Failed to load peoples data. Please try again later.';
  } finally {
    isLoading.value = false; // Reset loading state
  }
});
</script>