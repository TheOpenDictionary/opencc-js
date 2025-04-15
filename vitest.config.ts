import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    exclude: ['test/deno/**/*'],
    browser: {
      enabled: true,
      name: 'jsdom',
    },
  },
});