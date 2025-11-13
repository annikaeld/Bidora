import { defineConfig } from "vitest/config";
// Vitest sometimes has issues when Vite is not inlined in the test
// To disable inlining (for troubleshooting), set the env var
// `VITEST_INLINE=false` before running tests.
const shouldInlineVite = process.env.VITEST_INLINE !== "false";
const inlineDeps = shouldInlineVite ? ["vite"] : [];

const config = {
  test: {},
};

if (inlineDeps.length) {
  // Only add the server.deps.inline block when we actually have deps to
  // inline. This keeps the config minimal and avoids confusing deprecation
  // messages from Vitest when not needed.
  config.test.server = { deps: { inline: inlineDeps } };
}

export default defineConfig(config);
