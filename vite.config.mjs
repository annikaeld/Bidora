import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ESM-safe __dirname shim for Node-style path resolution in Vite config
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Multi-page inputs so Vite processes HTML files under subfolders (auctions/, profile/, etc.)
export default defineConfig({
  base: "/",
  build: {
    rollupOptions: {
      // Use keys that mirror the desired output paths so Rollup/Vite
      // preserves the `auctions/` and `profile/` folders in `dist/`.
      input: {
        main: resolve(__dirname, "index.html"),
        "auctions/index.html": resolve(__dirname, "auctions/index.html"),
        "auctions/edit.html": resolve(__dirname, "auctions/edit.html"),
        "auctions/listing.html": resolve(__dirname, "auctions/listing.html"),
        "profile/index.html": resolve(__dirname, "profile/index.html"),
      },
    },
  },
});
