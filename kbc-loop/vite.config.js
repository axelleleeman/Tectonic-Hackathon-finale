import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Twee pagina's, één codebase: index.html (web: presentatie + dashboards) en app.html (klantenapp).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        web: resolve(import.meta.dirname, 'index.html'),
        app: resolve(import.meta.dirname, 'app.html'),
      },
    },
  },
})
