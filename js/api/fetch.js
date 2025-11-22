import { headers } from "./headers.js";
import { displayMessage } from "../ui/displayMessage.js";

/**
 * Performs an authenticated fetch request with the appropriate headers.
 * Logs response errors and rethrows fetch errors.
 * @param {string} url - The URL to fetch.
 * @param {Object} [options={ method: "GET" }] - The fetch options (method, body, etc).
 * @returns {Promise<Response>} The fetch response.
 * @throws Will throw an error if the fetch fails.
 */
export async function authFetch(url, options = { method: "GET" }) {
  const requestOptions = {
    ...options,
    headers: headers(Boolean(options.body)),
  };
  try {
    const response = await fetch(url, requestOptions);
    if (response.status === 404) {
      return null; // Handle 404 by returning null
    }
    // Do not read the body or display messages here; let the caller handle it
    return response;
  } catch (error) {
    console.error("Fetch Error:", error);
    await displayMessage("Error", error.message);
    throw error;
  }
}
