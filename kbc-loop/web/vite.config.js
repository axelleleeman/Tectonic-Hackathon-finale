import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Twee pagina's: index.html (KBC-appspagina + presentatie en dashboards) en kbc.html (KBC Loop Insights, intern).
// De klantenapp is een apart Expo-project (../app) en wordt in productie onder /app/ geserveerd.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  build: {
    rollupOptions: {
      input: {
        web: resolve(import.meta.dirname, 'index.html'),
        kbc: resolve(import.meta.dirname, 'kbc.html'),
      },
    },
  },
})
