import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
        server: {
    port: 3000,
          open: true,
      },
        build: {
    outDir: 'dist',
          sourcemap: true,
      },
        // The index.html at repo root is the Vite entry point.
        // It must contain: <div id="root"></div> and
        // <script type="module" src="/src/main.jsx"></script>
      });
