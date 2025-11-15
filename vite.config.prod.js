import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production config for GitHub Pages deployment
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/portfolio-react/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor libraries into separate chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@mui/material') || id.includes('@emotion')) {
              return 'mui-core';
            }
            if (id.includes('@mui/icons-material')) {
              return 'mui-icons';
            }
            if (id.includes('framer-motion')) {
              return 'framer';
            }
            // Other node_modules go to vendor
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
