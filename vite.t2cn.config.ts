import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/t2cn.ts'),
      name: 'OpenCCJS_T2CN',
      formats: ['es', 'umd'],
      fileName: (format) => `t2cn.${format === 'es' ? 'mjs' : 'js'}`
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