import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/cn2t.ts'),
      name: 'OpenCCJS_CN2T',
      formats: ['es', 'umd'],
      fileName: (format) => `cn2t.${format === 'es' ? 'mjs' : 'js'}`
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