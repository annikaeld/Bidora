/**
 * Saves a value to localStorage under the specified key.
 * The value is stringified as JSON.
 * @param {string} key - The key under which to store the value.
 * @param {any} value - The value to store in localStorage.
 * @example
 * // Save a user object to localStorage
 * save('user', { name: 'Alice', age: 30 });
 */
export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
