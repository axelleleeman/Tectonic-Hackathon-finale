import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Drie pagina's, één codebase: index.html (web), app.html (klantenapp) en kbc.html (interne KBC-weergave).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        web: resolve(import.meta.dirname, 'index.html'),
        app: resolve(import.meta.dirname, 'app.html'),
        kbc: resolve(import.meta.dirname, 'kbc.html'),
      },
    },
  },
})
