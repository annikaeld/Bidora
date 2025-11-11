import { API_BASE, API_AUTH, API_LOGIN } from "../constants.js";
import { request } from "../request.js";

/**
 * Calls the login API and returns the response and data.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{response: A successful response will return a 200 OK status code and the user profile}>}
 */
export async function login(email, password) {
  console.log(`Log in for ${email}`);
  return await request(API_BASE + API_AUTH + API_LOGIN, "POST", {
    email,
    password,
  });
}
