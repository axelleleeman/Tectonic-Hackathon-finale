import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// KBC apps page + KBC LOOP page (with presentation and dashboards). KBC Loop Insights (apps/insights) and the
// customer app (apps/app) are separate apps; in production they go to dist/kbc/ and dist/app/, so the api serves everything from one address.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  // three.js (KBC LOOP hero) is loaded on demand in its own ~540 kB chunk; the main bundle stays small
  build: { chunkSizeWarningLimit: 600 },
})
