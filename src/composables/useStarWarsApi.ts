// src/composables/useStarWarsApi.ts
import { ref, watch, computed, type Ref } from 'vue' // Import 'computed'

// Defines the structure for a Star Wars entity.
export type StarWarsEntity = {
  name: string
  created: string
  url: string
  [key: string]: any // Allows for additional properties not explicitly defined.
}

/**
 * A Vue Composable to fetch, filter, and sort Star Wars API data.
 * It also handles fetching detailed information for a selected entity.
 *
 * @param entity The type of Star Wars entity to fetch ('people' or 'planets').
 * @returns An object containing reactive data and functions for API interaction.
 */
export function useStarWarsApi(entity: 'people' | 'planets' | 'films') {
  const rawData = ref<StarWarsEntity[]>([]) // Stores the original, un-filtered data from the API.
  const filteredAndSortedResults: Ref<StarWarsEntity[]> = ref([]) // Stores data after filtering and sorting.
  const loading = ref(false) // Indicates if the main data fetch is in progress.
  const error = ref<string | null>(null) // Stores any error message from the main data fetch.

  // Reactive state for filtering and sorting criteria.
  // These act as "inputs" for the composable to trigger re-filtering/re-sorting.
  const search = ref('') // The current search query.
  const sortKey = ref<'name' | 'created' | string>('name') // The key to sort by (made 'string' for flexibility).
  const sortAsc = ref(true) // True for ascending, false for descending sort order.

  // New state for handling item details.
  const selectedItem = ref<StarWarsEntity | null>(null) // The currently selected item for detail display.
  const loadingDetail = ref(false) // Indicates if fetching item details is in progress.
  const errorDetail = ref<string | null>(null) // Stores any error message from the detail fetch.

  /**
   * Formats a date string into a localized 'dd/mm/yyyy, hh:mm' format.
   * @param dateStr The date string to format.
   * @returns The formatted date string, or an empty string if input is invalid.
   */
  function formatDate(dateStr: string): string {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('en-GB', { // Changed to 'en-GB' for English locale
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  /**
   * Fetches data from the Star Wars API based on the `entity` type.
   * Data is fetched only once initially or when the `entity` type changes.
   */
  async function fetchData() {
    loading.value = true
    error.value = null
    try {
      const url = `https://swapi.info/api/${entity}` // Access entity directly as it's part of the watch dependency
      const data = await fetch(url).then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json()
      })
      // Map and format 'created' and 'edited' dates for each item.
      rawData.value = data.map((item: StarWarsEntity) => ({
        ...item,
        created: formatDate(item.created),
        edited: formatDate(item.edited),
      }))
    } catch (err: any) {
      error.value = err.message || 'Error fetching data'
      rawData.value = [] // Clear rawData on error
    } finally {
      loading.value = false
    }
  }

  /**
   * Applies filters (search) and sorting to the `rawData` and updates `filteredAndSortedResults`.
   * This function is called whenever `search`, `sortKey`, `sortAsc`, or `rawData` changes.
   */
  function applyFiltersAndSort() {
    let currentResults = [...rawData.value]; // Work with a copy of the raw data.

    // 1. Filter by search query.
    if (search.value) {
      currentResults = currentResults.filter(item =>
        item.name.toLowerCase().includes(search.value.toLowerCase())
      );
    }

    // 2. Sort the results.
    if (sortKey.value) {
      currentResults = currentResults.sort((a, b) => {
        const aVal = a[sortKey.value];
        const bVal = b[sortKey.value];

        // Handle null/undefined values during sorting.
        if (aVal === undefined && bVal === undefined) return 0;
        if (aVal === undefined) return sortAsc.value ? 1 : -1; // Undefined goes to end if asc, beginning if desc
        if (bVal === undefined) return sortAsc.value ? -1 : 1; // Undefined goes to end if asc, beginning if desc

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortAsc.value ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        // Assuming if not strings, they are directly comparable (numbers, etc.).
        return sortAsc.value ? (aVal > bVal ? 1 : -1) : (bVal > aVal ? 1 : -1);
      });
    }

    filteredAndSortedResults.value = currentResults; // Update the reactive filtered and sorted results.
  }

  /**
   * Fetches detailed information for a specific Star Wars entity by its ID.
   * @param id The ID of the entity to fetch details for.
   */
  async function fetchDetail(id: string) {
    loadingDetail.value = true
    errorDetail.value = null
    selectedItem.value = null // Clear previous selection

    try {
      const url = `https://swapi.info/api/${entity}/${id}` // Access entity directly
      const data = await fetch(url).then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json()
      })

      // Format the 'created' and 'edited' dates for the detailed item as well.
      selectedItem.value = {
        ...data,
        created: formatDate(data.created),
        edited: formatDate(data.edited),
      }
    } catch (err: any) {
      errorDetail.value = err.message || 'Error fetching details'
    } finally {
      loadingDetail.value = false
    }
  }

  // --- Watchers ---
  // Watch for changes in search, sortKey, sortAsc, or rawData to re-apply filters and sorting.
  watch([search, sortKey, sortAsc, rawData], applyFiltersAndSort, { immediate: true })

  // Watch for changes in the `entity` prop to refetch data.
  watch(() => entity, fetchData, { immediate: true })

  // Computed property for the total number of results after filtering and sorting.
  // This is crucial for components like `v-data-table` for pagination purposes.
  const totalResults = computed(() => filteredAndSortedResults.value.length);

  return {
    results: filteredAndSortedResults, // Exposes the filtered and sorted list of items.
    totalResults, // Exposes the total count of filtered/sorted results.
    loading, // Exposes the loading state of the main data fetch.
    error, // Exposes any error from the main data fetch.
    search, // Exposes the reactive search query.
    sortKey, // Exposes the reactive sort key.
    sortAsc, // Exposes the reactive sort direction.
    selectedItem, // Exposes the reactive selected item for details.
    loadingDetail, // Exposes the loading state of detail fetch.
    errorDetail, // Exposes any error from detail fetch.
    fetchDetail, // Exposes the function to fetch item details.
  }
}