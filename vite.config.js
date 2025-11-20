import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ESM-safe __dirname shim for Node-style path resolution in Vite config
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        auctions: resolve(__dirname, "auctions/index.html"),
        // Ensure individual pages under `auctions/` are processed too
        "auctions-edit": resolve(__dirname, "auctions/edit.html"),
        "auctions-listing": resolve(__dirname, "auctions/listing.html"),
        profile: resolve(__dirname, "profile/index.html"),
        // add any other HTML pages you need
      },
    },
  },
});
