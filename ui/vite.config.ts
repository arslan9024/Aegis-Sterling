import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3333,
    open: false,
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
          if (id.includes('src/components/WhiteCavesBook/masterLibraryData') || id.includes('src/components/WhiteCavesBook/chapter')) {
            return 'aegis-library-data';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});

