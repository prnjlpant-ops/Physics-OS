import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative asset paths so the built index.html works both served from a
  // web root ('/') and loaded via Electron's file:// protocol in production.
  base: './',
  build: {
    // Keep manually added question images in dist/questions between builds.
    emptyOutDir: false,
  },
  server: {
    // Fixed so electron/utilities/paths.cjs's DEV_SERVER_URL always matches.
    port: 5173,
    strictPort: true,
  },
})
