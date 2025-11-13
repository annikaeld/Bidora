import { API_BASE, API_LISTINGS, API_AUCTION } from "./constants.js";
import { authFetch } from "./fetch.js";

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
