import { API_BASE, API_AUCTION, API_LISTINGS } from "./constants.js";
import { authFetch } from "./fetch.js";
import { displayMessage } from "../ui/displayMessage.js";

/**
 * Updates a listing by its ID.
 * @param {string|number} id - The ID of the listing to update.
 * @param {object} listingObject - The updated listing data.
 * @returns {Promise<object>} The updated listing data.
 */
export async function updateListing(id, listingObject) {
  if (!id) throw new Error('Listing ID is required');
  try {
    const response = await authFetch(
      `${API_BASE}${API_AUCTION}${API_LISTINGS}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(listingObject),
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to update listing: ${response.statusText}`);
    }
    const responseBody = await response.json();
    return responseBody;
  } catch (error) {
    console.error("Error updating listing:", error);
    await displayMessage("Error updating listing", error.message);
    throw error;
  }
}

export async function postListing(listingObject) {
  try {
    const response = await authFetch(
      `${API_BASE}${API_AUCTION}${API_LISTINGS}`,
      {
        method: "POST",
        body: JSON.stringify(listingObject),
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to create listing: ${response.statusText}`);
    }
    const responseBody = await response.json();
    const data = responseBody.data;
    const id = data.id;
    console.log("Created listing with ID:", id);
    return id;
  } catch (error) {
    console.error("Error posting listing:", error);
    await displayMessage("Error posting listing", error.message);
    throw error;
  }
}

/**
 * Deletes a listing by its ID.
 * @param {string|number} id - The ID of the listing to delete.
 * @returns {Promise<Response>} The fetch response.
 */
export async function deleteListing(id) {
  console.log("Deleting listing with ID:", id);
  if (!id) throw new Error('Listing ID is required');
  const url = `${API_BASE}${API_AUCTION}${API_LISTINGS}/${id}`;
  const response = await authFetch(url, {
    method: 'DELETE'
  });
  return response.status === 204;
}
