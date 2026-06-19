import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // app.html is the Vite/React entry point.
  // index.html is the standalone vanilla demo (no build needed).
  root: '.',
  build: {
    rollupOptions: {
      input: './app.html',
    },
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: '/app.html',
  },
});
