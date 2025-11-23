import {
  API_BASE,
  API_LISTINGS,
  API_AUCTION,
  API_SEARCH,
} from "./constants.js";
import { authFetch } from "./fetch.js";
import { displayMessage } from "../ui/displayMessage.js";

/**
 * Place a bid on a listing by id.
 * @param {string} id - The listing/item id.
 * @param {number} amount - The bid amount.
 * @returns {Promise<object|null>} The API response data or null on error.
 */
export async function placeBid(id, amount) {
  
  if (!id || typeof amount !== "number" || amount <= 0) {
    displayMessage("placeBid: Invalid id or amount", id, amount);
    return null;
  }
  const url = `${API_BASE}${API_AUCTION}${API_LISTINGS}/${id}/bids`;
  try {
    const response = await authFetch(url, {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
    if (!response) {
      console.error("placeBid: No response from API");
      displayMessage("Response expected", "No response from API");
      return null;
    }
    if (!response.ok) {
      const errorBody = await response.json();
      const errors = errorBody.errors || [];
      const errorMessages = errors.map(err => err.message).join("; ");
      displayMessage("Failed to place bid.", errorMessages);
      return null;
    } else {
      const data = await response.json();
      return data;
    }
  } catch (e) {
    console.error("placeBid: Error placing bid", e);
    displayMessage("Error", e.message);
    return null;
  }
}

/**
 * Fetch listings/items from the API based on search and sortBy.
 * @param {string} searchFor - The search query string.
 * @param {string|null} sortBy - The sort/filter type (e.g., 'title', 'tag', etc), or null for all.
 * @returns {Promise<Array>} Array of items/listings from the API.
 */
export async function itemsFromApi(searchFor, sortBy) {
  const searchUrlPart = (searchFor === "") ? "" : API_SEARCH;
  let url = `${API_BASE}${API_AUCTION}${API_LISTINGS}${searchUrlPart}?_seller=true&_bids=true&_active=true`;
  if (searchFor) {
    url += `&q=${encodeURIComponent(searchFor)}`;
  }
  let sortOrderPart = "asc";
  if (sortBy === "Ends at") {
    sortBy = "endsAt";
    sortOrderPart = "&sortOrder=asc";
  }
  else if (sortBy === "Created") {
    sortBy = "created";
    sortOrderPart = "&sortOrder=desc";
  }
  url += `&sort=${encodeURIComponent(sortBy)}${sortOrderPart}`;

  const response = await authFetch(url);
  if (!response) {
    return [];
  }
  if (!response.ok) {
    console.error(
      "itemsFromApi: Failed to fetch items",
      response.status,
      response.statusText
    );
    displayMessage(
      "Error fetching items",
      `${response.status} ${response.statusText}`
    );
    return [];
  }
  try {
    let data = await response.json();
    if (searchFor) {
      data = await filterActiveItems(data);
    }
    return data;
  } catch (e) {
    console.error("itemsFromApi: Error parsing items JSON", e);
    displayMessage("Error", "Unexpected response format from API");
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
    displayMessage(
      "Error fetching item",
      `${response.status} ${response.statusText}`
    );
    return null;
  }
  try {
    return await response.json();
  } catch (e) {
    console.error("Error parsing item JSON", e);
    displayMessage("Error", "Unexpected response format from API");
    return null;
  }
}

export function filterActiveItems(items) {
  const now = new Date();
  var filteredItems = items.data.filter(item => {
    if (!item.endsAt) return true; // keep if no endsAt
    const endsAtDate = new Date(item.endsAt);
    return endsAtDate.getTime() > now.getTime();
  });
  return { data: filteredItems };
}
