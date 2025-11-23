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
    if (!response.ok) {
      let errorMsg = `Error: ${response.status} ${response.statusText}`;
      try {
        const data = await response.json();
        if (data && data.errors && Array.isArray(data.errors) && data.errors[0] && data.errors[0].message) {
          errorMsg = data.errors[0].message;
        } else if (data && data.message) {
          errorMsg = data.message;
        }
      } catch {
        // Ignore JSON parse errors, use default errorMsg
      }
      await displayMessage("Error", errorMsg);
    }
    return response;
  } catch (error) {
    console.error("Fetch Error:", error);
    await displayMessage("Error", error.message);
    throw error;
  }
}
