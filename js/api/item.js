import { API_BASE, API_LISTINGS, API_AUCTION, API_SEARCH } from "./constants.js";
import { authFetch } from "./fetch.js";

/**
 * Fetch listings/items from the API based on search and sortBy.
 * @param {string} searchFor - The search query string.
 * @param {string|null} sortBy - The sort/filter type (e.g., 'title', 'tag', etc), or null for all.
 * @returns {Promise<Array>} Array of items/listings from the API.
 */
export async function itemsFromApi(searchFor, sortBy) {
  let url = `${API_BASE}${API_AUCTION}${API_LISTINGS}${API_SEARCH}?_seller=true&_bids=true`;
  if (searchFor) {
    url += `&q=${encodeURIComponent(searchFor)}`;
  }
  if (sortBy && (sortBy === "endsAt" || sortBy === "created")) {
    url += `&sort=${encodeURIComponent(sortBy)}`;
  }
  const response = await authFetch(url);
  if (!response) {
    return [];
  }
  if (!response.ok) {
    //TODO: Show errors to users in UI
    console.error("itemsFromApi: Failed to fetch items", response.status, response.statusText);
    return [];
  }
  try {
    const data = await response.json();
    return data;
  } catch (e) {
    //TODO: Show errors to users in UI
    console.error("itemsFromApi: Error parsing items JSON", e);
    return [];
  }
}
/**
 * Fetch a single listing/item by id from the API.
 * Returns the parsed JSON item or null if not found / on error.
 */
export async function itemFromApi(id) {
  if (!id) return null;
  const url = `${API_BASE}${API_AUCTION}${API_LISTINGS}/${id}?_seller=true&_bids=true`;
  const response = await authFetch(url);
  if (!response) return null;
  if (!response.ok) {
    console.error("Failed to fetch item", response.status, response.statusText);
    return null;
  }
  try {
    return await response.json();
  } catch (e) {
    console.error("Error parsing item JSON", e);
    return null;
  }
}
