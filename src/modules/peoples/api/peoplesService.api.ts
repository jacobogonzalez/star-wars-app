import { fetchApi } from "../../core/utils/apiClient.util";
import { ApiResource } from '../../core/enums/ApiResources';
/**
 * Fetches a list of Star Wars characters (peoples) from the API.
 * This function uses a centralized API client to handle the request.
 * @returns {Promise<any>} A promise that resolves with the data for Star Wars characters.
 */
export async function getPeoples() {
  // Calls the generic fetchApi utility, targeting the 'people' endpoint.
  // The fetchApi function is responsible for making the HTTP request and parsing the response.
  return fetchApi(ApiResource.People);
}