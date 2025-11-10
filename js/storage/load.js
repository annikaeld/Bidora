/**
 * Loads and parses a value from localStorage by key.
 * @param {string} key - The key of the item to load from localStorage.
 * @returns {any} The parsed value from localStorage, or null if not found.
 */
export function load(key) {
  return JSON.parse(localStorage.getItem(key));
}
