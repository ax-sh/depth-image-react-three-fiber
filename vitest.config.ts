import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    name: 'happy-dom',
    // root: "./shared_tests",
    // environment: "node",
    environment: 'happy-dom',
    // setupFiles: ['./setup.happy-dom.ts'],:
  },
});
