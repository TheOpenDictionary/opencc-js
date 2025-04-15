import { defineConfig } from 'vite';
import { resolve } from 'path';

// Create separate configurations for each entry point
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'OpenCCJS',
      formats: ['es', 'umd'],
      fileName: (format) => `main.${format === 'es' ? 'mjs' : 'js'}`
    },
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Ensure UMD builds are properly named for browser use
        globals: {
          'opencc-js': 'OpenCC'
        }
      }
    },
    // Generate TypeScript declaration files
    emptyOutDir: false,
  },
  // Support browser environments
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  }
});