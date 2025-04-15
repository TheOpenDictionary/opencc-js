import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/full.ts'),
      name: 'OpenCCJS_Full',
      formats: ['es', 'umd'],
      fileName: (format) => `full.${format === 'es' ? 'mjs' : 'js'}`
    },
    outDir: 'dist',
    rollupOptions: {
      output: {
        globals: {
          'opencc-js': 'OpenCC'
        }
      }
    },
    emptyOutDir: false,
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  }
});