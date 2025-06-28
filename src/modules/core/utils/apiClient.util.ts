const BASE_API_PATH = import.meta.env.VITE_BASE_API_PATH;

/**
 * Fetches data from the Star Wars API.
 * This is a generic utility function for making API requests.
 *
 * @param url The specific endpoint to append to the base API path (e.g., 'people', 'planets').
 * @returns A Promise that resolves with the JSON response from the API.
 * @throws An Error if the network response is not OK (e.g., 404, 500 status codes).
 */
export async function fetchApi(url: string) {
  // Construct the full URL by combining the base path and the provided endpoint.
  return await fetch(`${BASE_API_PATH}${url}`)
    .then(res => {
      // Check if the HTTP response was successful (status code 200-299).
      if (!res.ok) {
        // If not successful, throw an error with the status code.
        throw new Error(`Error: ${res.status} - ${res.statusText || 'An error occurred'}`);
      }
      // If successful, parse the response body as JSON.
      return res.json();
    });
}