// Resets the shared demo state by POSTing { type: 'RESET' } to the API.
// Usage: npm run demo:reset            (API_URL defaults to http://127.0.0.1:4000)
//        API_URL=https://kbc-loop.example.run.app API_KEY=... npm run demo:reset
// Plain http is only allowed to localhost; any other address must use https.
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]']

function fail(message) {
  console.error(`demo:reset: ${message}`)
  process.exit(1)
}

let url
try { url = new URL(process.env.API_URL || 'http://127.0.0.1:4000') } catch { fail('API_URL is not a valid URL') }
if (url.username || url.password) fail('API_URL must not contain credentials; use API_KEY')
if (!(url.protocol === 'https:' || (url.protocol === 'http:' && LOCAL_HOSTS.includes(url.hostname)))) {
  fail(`refusing insecure URL ${url.origin}: use https outside localhost`)
}

const headers = { 'content-type': 'application/json', origin: url.origin }
if (process.env.API_KEY) headers.authorization = `Bearer ${process.env.API_KEY}`

try {
  const res = await fetch(new URL('/api/actions', url), {
    method: 'POST',
    headers,
    body: JSON.stringify({ type: 'RESET' }),
    signal: AbortSignal.timeout(10_000),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = typeof body.error === 'string' ? body.error : body.error?.message
    fail(`${res.status} ${err ?? res.statusText}${body.error?.code ? ` (${body.error.code})` : ''}`)
  }
  console.log(`Demo state reset on ${url.origin} (version ${body.version})`)
} catch (err) {
  fail(`could not reach ${url.origin}: ${err.message}`)
}
