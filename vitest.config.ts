import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    // name: 'happy-dom',
    // root: "./shared_tests",
    // environment: "node",
    // environment: 'jsdom',
    environment: 'happy-dom',
    browser: {
      enabled: false,
      name: 'chromium',
      provider: 'playwright',
    },

    // setupFiles: ['./setup.happy-dom.ts'],:
  },
});
