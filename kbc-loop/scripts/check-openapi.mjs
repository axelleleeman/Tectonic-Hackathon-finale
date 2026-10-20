// Checks that docs/openapi.yaml documents every API route and every action type.
// Usage: npm run docs:check (also runs as part of npm test). A text check, no YAML parser needed.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ACTION_TYPES } from '@kbc-loop/shared/state/loopReducer.js'

const root = join(import.meta.dirname, '..')
const read = (p) => readFileSync(join(root, p), 'utf8')
const spec = read('docs/openapi.yaml')
const missing = []

if (!/^openapi: 3\.1\.\d+$/m.test(spec)) missing.push('openapi: 3.1.x header')
const server = read('apps/api/src/server.js')
for (const m of server.matchAll(/pathname === '(\/api\/[^']*)'/g)) if (!spec.includes(`  ${m[1]}:`)) missing.push(`path ${m[1]}`)
if (server.includes("PARTNER_PATH = '/api/catalog/partners/'") && !spec.includes('/api/catalog/partners/{id}:')) missing.push('path /api/catalog/partners/{id}')
if (!spec.includes('/api/live')) missing.push('WebSocket /api/live')
for (const type of ACTION_TYPES) if (!spec.includes(type)) missing.push(`action type ${type}`)
for (const code of ['bad_request', 'unsupported_media_type', 'payload_too_large', 'not_found', 'rate_limited', 'unauthorized', 'forbidden_origin', 'internal']) {
  if (!spec.includes(code)) missing.push(`error code ${code}`)
}

if (missing.length) {
  console.error('docs/openapi.yaml is out of date. Missing:')
  for (const m of missing) console.error(`  - ${m}`)
  process.exit(1)
}
console.log('OpenAPI spec is up-to-date')
