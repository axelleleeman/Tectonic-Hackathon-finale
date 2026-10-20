// Verbinding met de KBC Loop-api, gedeeld door apps/web en apps/insights. In ontwikkeling draait de api op poort 4000 van dezelfde computer;
// in productie serveert de api ook deze web, dus is het hetzelfde (HTTPS-)adres.
import { createLoopClient } from '@kbc-loop/shared/client.js'

const dev = import.meta.env.DEV
const here = `${window.location.protocol}//${window.location.hostname}`

export const API_URL = import.meta.env.VITE_API_URL || (dev ? `${here}:4000` : window.location.origin)

// De klantenapp (Expo) voor de iframe in het perspectief Klant: in ontwikkeling de Expo-webserver,
// in productie de geëxporteerde web-versie van de app onder /app/.
export const APP_URL = import.meta.env.VITE_APP_URL || (dev ? `${here}:8081` : `${window.location.origin}/app/`)

// KBC Loop Insights (interne KBC-weergave, apps/insights): in ontwikkeling poort 5174, in productie onder /kbc/.
export const INSIGHTS_URL = import.meta.env.VITE_INSIGHTS_URL || (dev ? `${here}:5174` : `${window.location.origin}/kbc/`)

// Onversleutelde http enkel in ontwikkeling; VITE_API_KEY is zichtbaar in de browser, dus geen echt geheim.
export const client = createLoopClient(API_URL, { apiKey: import.meta.env.VITE_API_KEY || null, allowInsecure: dev })
