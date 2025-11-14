// Read environment variables injected at build time by Vite.
// Use a `.env` file with `VITE_` prefixes for local development (see `.env.example`).
export const API_KEY = import.meta.env.VITE_API_KEY || "";
export const API_BASE =
  import.meta.env.VITE_API_BASE || "https://v2.api.noroff.dev";
export const API_AUTH = "/auth";
export const API_LOGIN = "/login";
export const API_REGISTER = "/register";
export const API_AUCTION = "/auction";
export const API_LISTINGS = "/listings";
export const API_PROFILES = "/profiles";
