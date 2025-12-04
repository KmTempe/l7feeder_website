import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    viteCompression(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
    }),
  ],
  base: '/',
  server: {
    host: true,
    port: 3005,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@react-pdf')) {
              return 'react-pdf';
            }
            if (id.includes('framer-motion')) {
              return 'framer';
            }
            if (id.includes('@mui/icons-material')) {
              return 'mui-icons';
            }
            if (id.includes('@mui/material') || id.includes('@emotion')) {
              return 'mui-core';
            }
            if (id.includes('react-dom')) {
              return 'react-dom';
            }
            if (id.includes('@vercel')) {
              return 'vercel';
            }
            if (id.includes('react')) {
              return 'react-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
