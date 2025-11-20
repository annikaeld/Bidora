import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        auctions: resolve(__dirname, "auctions/index.html"),
        profile: resolve(__dirname, "profile/index.html"),
        // add any other HTML pages you need
      },
    },
  },
});
