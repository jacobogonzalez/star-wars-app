  export function applyFiltersAndSort({data, elementToSearch, sortKey, sortAsc}: {data: any, elementToSearch: string, sortKey: string, sortAsc: boolean}) {
    let currentResults = [...data];

    // 1. Filter by search query.
    if (elementToSearch) {
      currentResults = currentResults.filter(item =>
        item.name.toLowerCase().includes(elementToSearch.toLowerCase())
      );
    }

    // 2. Sort the results.
    if (sortKey) {
      currentResults = currentResults.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        // Handle null/undefined values during sorting.
        if (aVal === undefined && bVal === undefined) return 0;
        if (aVal === undefined) return sortAsc ? 1 : -1; // Undefined goes to end if asc, beginning if desc
        if (bVal === undefined) return sortAsc ? -1 : 1; // Undefined goes to end if asc, beginning if desc

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        // Assuming if not strings, they are directly comparable (numbers, etc.).
        return sortAsc ? (aVal > bVal ? 1 : -1) : (bVal > aVal ? 1 : -1);
      });
    }
    return currentResults
  }

  /**
 * Extracts the numerical ID from a Star Wars API URL.
 * Example: "https://swapi.dev/api/peoples/1/" would return "1".
 * @param url The full API URL of the entity.
 * @returns The extracted ID as a string.
 */
export function extractIdFromUrl(url: string): string {
  const parts = url.split('/')
  // Returns the last non-empty segment of the URL, which typically contains the ID.
  return parts[parts.length - 1] || parts[parts.length - 2]
}