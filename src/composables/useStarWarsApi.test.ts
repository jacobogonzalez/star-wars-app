import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useStarWarsApi } from './useStarWarsApi'

// Mock the global fetch function to control API responses
global.fetch = vi.fn()

// Sample data to be returned by the mocked API
const mockData = [
  { name: 'Luke Skywalker', created: '2020-01-01T00:00:00Z', url: 'url1', edited: '2020-01-01T00:00:00Z' },
  { name: 'Darth Vader', created: '2019-01-01T00:00:00Z', url: 'url2', edited: '2019-01-01T00:00:00Z' },
  { name: 'Leia Organa', created: '2021-01-01T00:00:00Z', url: 'url3', edited: '2021-01-01T00:00:00Z' },
]

describe('useStarWarsApi', () => {
  // Reset the mock fetch before each test to ensure isolation
  beforeEach(() => {
    (fetch as any).mockReset()
  })

  it('fetches data, filters, and sorts automatically', async () => {
    // Mock a successful API response
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    })

    // Initialize the composable
    const {
      results,
      search,
      sortKey,
      sortAsc,
      loading,
      error,
    } = useStarWarsApi('people')

    // Wait for the initial data fetch and reactivity updates
    // A small timeout ensures async operations like fetch complete
    await new Promise((r) => setTimeout(r, 0))
    await nextTick() // Ensure Vue's reactivity system has processed updates

    // --- Validate initial fetch ---
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    // Check that results contain the mock data after initial fetch and sorting (default sort by name asc)
    expect(results.value.length).toBe(3)
    expect(results.value.map((p) => p.name)).toEqual([
      'Darth Vader',
      'Leia Organa',
      'Luke Skywalker',
    ]);


    // --- Test filtering ---
    search.value = 'Luke' // Update the search query
    await nextTick() // Wait for reactivity to apply the filter

    // Expect results to be filtered
    expect(results.value.map((p) => p.name)).toEqual(['Luke Skywalker'])

    // --- Reset filter before sorting tests ---
    search.value = '' // Clear the search query
    await nextTick() // Wait for reactivity to clear the filter

    // --- Test descending sort by creation date ---
    sortKey.value = 'created' // Set the sort key
    sortAsc.value = false // Set sort order to descending
    await nextTick() // Wait for reactivity to apply the sorting

    // Expect results to be sorted by creation date in descending order
    expect(results.value.map((p) => p.name)).toEqual([
      'Leia Organa', // Created 2021
      'Luke Skywalker', // Created 2020
      'Darth Vader', // Created 2019
    ])

    // --- Test ascending sort by name ---
    sortKey.value = 'name' // Set the sort key back to name
    sortAsc.value = true // Set sort order to ascending
    await nextTick() // Wait for reactivity to apply the sorting

    // Expect results to be sorted by name in ascending order
    expect(results.value.map((p) => p.name)).toEqual([
      'Darth Vader',
      'Leia Organa',
      'Luke Skywalker',
    ])
  })

  it('handles fetch error gracefully', async () => {
    // Mock a failed API response
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    })

    // Initialize the composable
    const { error, loading, results } = useStarWarsApi('people')

    // Wait for the fetch operation to complete
    await new Promise((r) => setTimeout(r, 0))
    await nextTick() // Ensure Vue's reactivity system has processed updates

    // Expect an error message and loading to be false
    expect(error.value).toMatch(/Error 500/)
    expect(loading.value).toBe(false)
    expect(results.value).toEqual([]); // Ensure results are cleared on error
  })

  it('fetches and formats detail data', async () => {
    // Mock main data fetch
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    // Mock detail data fetch
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: 'Luke Skywalker',
        created: '2020-01-01T10:30:00.000Z',
        url: 'url1',
        height: '172',
        edited: '2020-01-05T12:00:00.000Z'
      }),
    });

    const { selectedItem, loadingDetail, errorDetail, fetchDetail } = useStarWarsApi('people');

    // Wait for initial data fetch (which is mocked first)
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();

    // Trigger detail fetch
    fetchDetail('1'); // Use a dummy ID as the mock doesn't care about the actual ID

    await new Promise((r) => setTimeout(r, 0));
    await nextTick();

    expect(loadingDetail.value).toBe(false);
    expect(errorDetail.value).toBeNull();
    expect(selectedItem.value).not.toBeNull();
    expect(selectedItem.value?.name).toBe('Luke Skywalker');
    // Verify date formatting
    expect(selectedItem.value?.created).toBe('01/01/2020, 10:30'); // Using en-GB format
    expect(selectedItem.value?.edited).toBe('05/01/2020, 12:00'); // Using en-GB format
  });

  it('handles detail fetch error', async () => {
    // Mock main data fetch
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    // Mock detail data fetch error
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { selectedItem, loadingDetail, errorDetail, fetchDetail } = useStarWarsApi('people');

    // Wait for initial data fetch
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();

    // Trigger detail fetch
    fetchDetail('non-existent-id');

    await new Promise((r) => setTimeout(r, 0));
    await nextTick();

    expect(loadingDetail.value).toBe(false);
    expect(selectedItem.value).toBeNull();
    expect(errorDetail.value).toMatch(/Error 404/);
  });
});