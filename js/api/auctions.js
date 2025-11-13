import { API_BASE, API_AUCTION, API_LISTINGS } from "./constants.js";
import { authFetch } from "./fetch.js";

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
    throw error;
  }
}
