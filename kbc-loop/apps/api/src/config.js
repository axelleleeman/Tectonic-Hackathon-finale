// Instellingen uit omgevingsvariabelen, met veilige standaardwaarden.
//   PORT             poort (4000)
//   HOST             adres (127.0.0.1: enkel deze computer; 0.0.0.0 om een gsm op hetzelfde wifi toe te laten)
//   DB_PATH          SQLite-bestand (api/data/kbc-loop.db)
//   STATIC_DIR       map met de gebouwde web (+ kbc/ en app/) om mee te serveren (productie)
//   ALLOWED_ORIGINS  komma-lijst van websites die de api mogen aanspreken (standaard enkel de lokale dev-servers)
//   API_KEY          optioneel: verplicht deze sleutel op alle api-verzoeken (aanbevolen zodra de api op een netwerk staat)
//   TRUST_PROXY      'true' achter een HTTPS-proxy (bv. Cloud Run), om x-forwarded-proto/-for te vertrouwen
//   PROXY_HOPS       aantal vertrouwde proxy's vóór de api (1); bepaalt welk x-forwarded-for-adres telt
//   NODE_ENV         'production' zet HSTS aan
const DEV_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174', 'http://localhost:8081', 'http://127.0.0.1:8081']

const list = (v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : null)

export function loadConfig(env = process.env) {
  return {
    port: Number(env.PORT ?? 4000),
    host: env.HOST ?? '127.0.0.1',
    dbPath: env.DB_PATH ?? new URL('../data/kbc-loop.db', import.meta.url).pathname,
    staticDir: env.STATIC_DIR || null,
    allowedOrigins: list(env.ALLOWED_ORIGINS) ?? DEV_ORIGINS,
    apiKey: env.API_KEY || null,
    trustProxy: env.TRUST_PROXY === 'true',
    proxyHops: Math.max(1, Number.parseInt(env.PROXY_HOPS, 10) || 1),
    production: env.NODE_ENV === 'production',
  }
}
