import { API_BASE, API_AUTH, API_REGISTER } from "../constants.js";
import { request } from "../request.js";

/**
 * Calls the register API and returns the response and data.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{response: Response, data: any}>}
 */
export async function registerUser(name, email, password) {
  return await request(API_BASE + API_AUTH + API_REGISTER, "POST", {
    name,
    email,
    password,
  });
}
