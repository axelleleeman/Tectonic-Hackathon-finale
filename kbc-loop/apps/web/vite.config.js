import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// KBC-appspagina + presentatie en dashboards. KBC Loop Insights (apps/insights) en de klantenapp (apps/app)
// zijn aparte apps; in productie komen ze in dist/kbc/ en dist/app/, zodat de api alles op één adres serveert.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
})
