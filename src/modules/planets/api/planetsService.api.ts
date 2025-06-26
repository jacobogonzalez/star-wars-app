import { fetchApi } from "../../core/utils/apiClient.util";

/**
 * Fetches a list of planets from the Star Wars API.
 * This function utilizes a generic API client to make the request.
 * @returns {Promise<any>} A promise that resolves to the planets data.
 */
export async function getPlanets() {
  // Calls the generic fetchApi utility with the 'planets' endpoint.
  // The fetchApi function is expected to handle the actual HTTP request
  // and potential JSON parsing.
  return fetchApi('planets');
}