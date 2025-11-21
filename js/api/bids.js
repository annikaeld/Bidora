import { API_BASE, API_AUCTION, API_PROFILES } from "./constants.js";
import { authFetch } from "./fetch.js";
import { displayMessage } from "../ui/displayMessage.js";
import { load } from "../storage/load.js";

/**
 * Fetches the current user's bids from the API.
 * @returns {Promise<Object|null>} The bids data or null on error.
 */
export async function getBids() {
  const profile = load("profile");
  const username = profile && profile.name;
  if (!username) return null;
  const url = `${API_BASE}${API_AUCTION}${API_PROFILES}/${username}/bids?_listings=true&_wins=true`;
  try {
    const response = await authFetch(url);
    if (!response) return null;
    if (!response.ok) {
      console.error("Failed to fetch bids", response.status, response.statusText);
      displayMessage(
        "Error fetching bids",
        `${response.status} ${response.statusText}`
      );
      return null;
    }
    const data = (await response.json()).data;
    return data;
  } catch (e) {
    console.error("Error fetching bids", e);
    displayMessage("Error", e.message);
    return null;
  }
}
