<template>
  <v-card width="100%" height="500px">
    <v-card-text>
      <div>
        <div class="d-flex align-center justify-end mb-4" style="gap: 0.5rem; flex-wrap: wrap;">
          <v-select
            v-model="localSortCombined"
            :items="combinedSortOptions"
            label="Sort by"
            hide-details
            dense
            style="max-width: 250px;"
            variant="outlined"
            density="compact"
            data-testid="sort-select"
          />

          <v-text-field
            v-model="localSearch"
            data-testid="search-input"
            label="Search..."
            single-line
            hide-details
            variant="outlined"
            dense
            style="max-width: 250px;"
            append-inner-icon="mdi-magnify"
            density="compact"
          />
        </div>

        <div>
          <v-skeleton-loader v-if="loading" type="card@5" class="mb-4" />

          <v-row dense class="containerCards">
            <v-col v-for="item in paginatedItems" :key="item.name" cols="12" sm="6" md="4">
              <GridCard :item="item" @click="$emit('row-click', item)" />
            </v-col>
          </v-row>

          <Alert v-if="!loading && items.length === 0" message="No results found." type="info" />

          <v-pagination
            v-if="pageCount > 1"
            v-model="page"
            :length="pageCount"
            density="compact"
            active-color="primary"
            rounded="circle"
            class="mt-4 align-self-center"
             data-testid="pagination"
          />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

// --- Component Imports ---
import GridCard from './GridCard.vue';
import Alert from '../../core/components/Alert.vue';

// --- Props Definition ---
const props = defineProps<{
  /**
   * Array of items (e.g., people, planets) to be displayed in the grid.
   */
  items: any[];
  /**
   * The current search query string applied to the items.
   */
  search: string;
  /**
   * Boolean indicating if the data is currently being loaded.
   */
  loading: boolean;
  /**
   * The key by which the items are currently sorted (e.g., 'name', 'created').
   */
  sortBy: string;
  /**
   * Boolean indicating the sort direction (true for descending, false for ascending).
   * Note: This prop receives `!sortAsc` from the parent.
   */
  sortDesc: boolean;
}>();

// --- Emits Definition ---
const emit = defineEmits([
  /**
   * Emitted when the search query changes.
   * @event update:search
   * @type {string}
   */
  'update:search',
  /**
   * Emitted when the field by which to sort changes.
   * @event update:sortBy
   * @type {string}
   */
  'update:sortBy',
  /**
   * Emitted when the sort direction changes.
   * @event update:sortDesc
   * @type {boolean}
   */
  'update:sortDesc',
  /**
   * Emitted when the current page number changes (though pagination is handled internally for now).
   * @event update:page
   * @type {number}
   */
  'update:page',
  /**
   * Emitted when an individual item card is clicked.
   * @event row-click
   * @type {any} The item object that was clicked.
   */
  'row-click',
]);

// --- Local State for Input Binding ---
// Local ref for search input, allows internal control before emitting.
const localSearch = ref(props.search);

// Computed property for the combined sort value (e.g., 'name:asc') for the v-select.
// Uses a getter and setter to correctly handle v-model and emit updates.
const localSortCombined = computed({
  get: () => {
    // If sortBy prop is empty, default to 'name:asc' to ensure a valid initial display.
    if (!props.sortBy) {
      return 'name:asc'; // Default value if sortBy is not provided initially
    }
    const direction = props.sortDesc ? 'desc' : 'asc';
    return `${props.sortBy}:${direction}`;
  },
  set: (newValue: string) => {
    // When the v-select value changes, parse it and emit updates to the parent.
    const [sortBy, sortDir] = newValue.split(':');
    emit('update:sortBy', sortBy);
    emit('update:sortDesc', sortDir === 'desc');
    page.value = 1; // Reset to the first page when sorting changes
  }
});


// --- Pagination Logic ---
const itemsPerPage = 10; // Fixed number of items to display per page.
const page = ref(1); // Reactive reference for the current page number.

/**
 * Computed property that calculates the total number of pages
 * based on the total number of items and items per page.
 */
const pageCount = computed(() => Math.ceil(props.items.length / itemsPerPage));

/**
 * Computed property that returns a slice of `props.items`
 * corresponding to the current page. This ensures only the items
 * for the active page are displayed, optimizing rendering performance.
 */
const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage; // Calculate the starting index for the current page.
  const end = start + itemsPerPage; // Calculate the ending index.
  return props.items.slice(start, end); // Slice the array to get items for the current page.
});

// --- Sorting Options ---
/**
 * Defines the options for the 'Sort by' dropdown.
 * Each option has a user-friendly title and a value combining the sort key and direction.
 */
const combinedSortOptions = [
  { title: 'Name Ascending', value: 'name:asc' },
  { title: 'Name Descending', value: 'name:desc' },
  { title: 'Creation Date Ascending', value: 'created:asc' }, // Assuming 'created' is the date field
  { title: 'Creation Date Descending', value: 'created:desc' },
];

// --- Watchers for Emitting Updates to Parent ---

/**
 * Watches for changes in the `localSearch` input and emits the new search query.
 */
watch(localSearch, (val) => {
  emit('update:search', val);
  page.value = 1; // Reset to first page on new search
});

// Watch for external changes to props.search and update localSearch
watch(() => props.search, (newVal) => {
  localSearch.value = newVal;
});

// No need for a separate watcher for props.sortBy/sortDesc to update localSortCombined
// because localSortCombined is now a computed property with a getter/setter
// that automatically reacts to changes in its dependencies (props.sortBy, props.sortDesc).

</script>

<style lang="scss" scoped>
/* Scoped styles for the component */
.containerCards {
  max-height: 380px; /* Limits the height of the cards container, enabling scrolling */
  overflow-y: auto; /* Enables vertical scrolling if content exceeds max-height */
  padding-right: 8px; /* Add some padding to prevent scrollbar from overlapping content */
}
</style>