// Verbinding met de KBC Loop-api, gedeeld door apps/web en apps/insights. In ontwikkeling draait de api op poort 4000 van dezelfde computer;
// in productie serveert de api ook deze web, dus is het hetzelfde (HTTPS-)adres.
//
// Demo mode (VITE_DEMO_MODE=true at build time, see scripts/build-demo.mjs): no api at all. The state lives in the
// browser (localStorage) and is shared live between tabs and the app iframe on the same origin (createLocalClient).
import { createLoopClient } from '@kbc-loop/shared/client.js'
import { createLocalClient } from '@kbc-loop/shared/localClient.js'

const dev = import.meta.env.DEV
const here = `${window.location.protocol}//${window.location.hostname}`

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

export const API_URL = DEMO_MODE ? window.location.origin : import.meta.env.VITE_API_URL || (dev ? `${here}:4000` : window.location.origin)

// De klantenapp (Expo) voor de iframe in het perspectief Klant: in ontwikkeling de Expo-webserver,
// in productie (en in demo mode) de geëxporteerde web-versie van de app onder /app/.
export const APP_URL = DEMO_MODE ? `${window.location.origin}/app/` : import.meta.env.VITE_APP_URL || (dev ? `${here}:8081` : `${window.location.origin}/app/`)

// KBC Loop Insights (interne KBC-weergave, apps/insights): in ontwikkeling poort 5174, in productie onder /kbc/.
export const INSIGHTS_URL = DEMO_MODE ? `${window.location.origin}/kbc/` : import.meta.env.VITE_INSIGHTS_URL || (dev ? `${here}:5174` : `${window.location.origin}/kbc/`)

// Onversleutelde http enkel in ontwikkeling; VITE_API_KEY is zichtbaar in de browser, dus geen echt geheim.
export const client = DEMO_MODE
  ? createLocalClient()
  : createLoopClient(API_URL, { apiKey: import.meta.env.VITE_API_KEY || null, allowInsecure: dev })
