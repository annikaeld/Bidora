import { API_BASE, API_AUCTION, API_LISTINGS } from "./constants.js";
import { authFetch } from "./fetch.js";
import { displayMessage } from "../ui/displayMessage.js";

/**
 * Fetches all auctions with author information.
 * @returns {Promise<Object>} The auctions data.
 * @throws Will throw an error if the fetch fails.
 */
export async function getAuctions() {
  try {
    const response = await authFetch(
      `${API_BASE}${API_AUCTION}${API_LISTINGS}?sort=created&_seller=true&_bids=true&_active=true`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch auctions: ${response.statusText}`);
    }

    const auctions = await response.json();
    console.log("Fetched auctions:", auctions);
    return auctions;
  } catch (error) {
    console.error("Error fetching auctions:", error);
    await displayMessage("Error fetching auctions", error.message);
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
  if (!id) throw new Error('Listing ID is required');
  const url = `${API_BASE}${API_AUCTION}${API_LISTINGS}/${id}`;
  const response = await authFetch(url, {
    method: 'DELETE'
  });
  return response.status === 204;
}
