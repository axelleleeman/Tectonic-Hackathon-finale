// Verbinding met de KBC Loop-api. De app houdt zelf geen state bij: alles komt van de api
// (REST + WebSocket) en elke actie gaat als POST naar de api.
import { Platform } from 'react-native'
import Constants from 'expo-constants'
import { createLoopClient } from '@kbc-loop/shared/client.js'

const DEV_PORT = 4000

// Adres van de api in ontwikkeling: dezelfde computer als de Expo-devserver.
function devApiUrl() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') return `http://${window.location.hostname}:${DEV_PORT}`
  // hostUri is bv. "192.168.1.20:8081" (Expo Go op een gsm) of "localhost:8081" (simulator).
  const host = Constants.expoConfig?.hostUri?.split(':')[0]
  if (host) return `http://${host}:${DEV_PORT}`
  // Android-emulator zonder hostUri: 10.0.2.2 is de computer waarop de emulator draait.
  return Platform.OS === 'android' ? `http://10.0.2.2:${DEV_PORT}` : `http://localhost:${DEV_PORT}`
}

export function apiUrl() {
  // Moet letterlijk zo geschreven staan, zodat Expo de waarde bij het bouwen invult.
  const fromEnv = process.env.EXPO_PUBLIC_API_URL
  if (fromEnv) return fromEnv
  if (__DEV__) return devApiUrl()
  // Productie op het web: de api serveert deze app zelf onder /app/, dus zelfde (https-)adres.
  if (Platform.OS === 'web' && typeof window !== 'undefined') return window.location.origin
  throw new Error('Geen api-adres ingesteld. Zet EXPO_PUBLIC_API_URL op een https-adres van de KBC Loop-api voor je de app bouwt.')
}

// Optioneel. Let op: dit is GEEN geheim. EXPO_PUBLIC_-variabelen zitten leesbaar in de app-bundel;
// de sleutel schermt de api enkel af tegen toevallige verzoeken.
const API_KEY = process.env.EXPO_PUBLIC_API_KEY || null

let client = null

/** Eén gedeelde client. Gooit een fout als er geen (veilig) api-adres is. */
export function getClient() {
  // Onversleutelde http enkel in ontwikkeling; in productie weigert de client alles behalve https.
  client ??= createLoopClient(apiUrl(), { apiKey: API_KEY, allowInsecure: __DEV__ })
  return client
}
