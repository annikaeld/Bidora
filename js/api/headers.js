import { load } from "../storage/load.js";
import { API_KEY } from "./constants.js";

/**
 * Constructs and returns the headers for an API request.
 * Adds Authorization, API key, and Content-Type headers as needed.
 * @param {boolean} [hasBody=false] - Whether the request has a body (adds Content-Type if true).
 * @returns {Headers} The constructed Headers object.
 */
export function headers(hasBody = false) {
  const headers = new Headers();
  const token = load("token");
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  if (API_KEY) {
    headers.append("X-Noroff-API-Key", API_KEY);
  }
  if (hasBody) {
    headers.append("Content-Type", "application/json");
  }
  return headers;
}
