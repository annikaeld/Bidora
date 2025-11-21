import { defineConfig } from "vitest/config";
// Vitest sometimes has issues when Vite is not inlined in the test
// To disable inlining, set the env var
// `VITEST_INLINE=false` before running tests.
const shouldInlineVite = process.env.VITEST_INLINE !== "false";
const inlineDeps = shouldInlineVite ? ["vite"] : [];

const config = {
  test: {
    // Exclude Playwright E2E tests and any vendor tests in node_modules
    // from Vitest's file discovery.
    exclude: ["**/tests/e2e/**", "**/node_modules/**"],
  },
};

if (inlineDeps.length) {
  config.test.server = { deps: { inline: inlineDeps } };
}

export default defineConfig(config);
