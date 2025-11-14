import { load } from "./load.js";
import { remove } from "./remove.js";

export function isLoggedIn() {
  return Boolean(load("token"));
}

export function logoutUser() {
  remove("token");
  remove("profile");
}
