import { defineConfig } from "vite";

// Static base for repo deployment. If you want to deploy under a subpath
// (for example GitHub Pages at /annikaeld/Bidora/), set this to that path.
export default defineConfig({
  base: "/repo/",
});
