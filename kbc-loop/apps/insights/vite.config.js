import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// KBC Loop Insights: interne dashboard voor KBC-medewerkers. In productie geserveerd onder /kbc/
// (gebouwd in apps/web/dist/kbc, zodat de api web, insights en app vanaf één adres serveert).
export default defineConfig({
  base: '/kbc/',
  plugins: [react()],
  server: { port: 5174, strictPort: true },
  build: { outDir: resolve(import.meta.dirname, '../web/dist/kbc'), emptyOutDir: true },
})
