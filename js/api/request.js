/**
 * Sends an HTTP request to the specified URL with the given method and body.
 * @param {string} url - The URL to send the request to.
 * @param {string} method - The HTTP method (e.g., "GET", "POST", "PUT", "DELETE").
 * @param {Object} [body] - The request body to send (will be JSON-stringified).
 * @returns {Promise<{response: Response, data: any}>} The fetch response and parsed JSON data.
 */
export async function request(url, method, body) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(url, options);
  const data = await response.json();

  return { response, data };
}
