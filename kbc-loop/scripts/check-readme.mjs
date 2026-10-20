// Controleert of README.md de echte opbouw van het project beschrijft.
// Gebruik: npm run check:readme (draait ook mee met npm test).
//   1. elke workspace-map en elke submap van shared/src, api/src, web/src, app/src, en elk bestand in api/src
//   2. elk npm-script uit package.json
//   3. elk api-pad uit api/src/server.js en het WebSocket-pad uit api/src/live.js
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const read = (p) => readFileSync(join(root, p), 'utf8')
const readme = read('README.md')
const IGNORE = new Set(['node_modules', 'dist', '.expo', 'assets'])

const missing = []
const expect = (name, what) => { if (!readme.includes(name)) missing.push(`${what}: ${name}`) }

const entries = (dir) => (existsSync(join(root, dir)) ? readdirSync(join(root, dir), { withFileTypes: true }) : [])

// 1. Mappen en bestanden
const workspaces = JSON.parse(read('package.json')).workspaces ?? []
for (const ws of workspaces) {
  expect(`${ws}/`, 'workspace-map')
  for (const e of entries(`${ws}/src`)) {
    if (e.isDirectory() && !IGNORE.has(e.name) && !e.name.startsWith('.')) expect(`${e.name}/`, `map in ${ws}/src`)
  }
}
for (const e of entries('api/src')) if (e.isFile()) expect(e.name, 'bestand in api/src')

// 2. npm-scripts
for (const name of Object.keys(JSON.parse(read('package.json')).scripts ?? {})) expect(name, 'npm-script')

// 3. Api-paden
const routes = new Set()
for (const m of read('api/src/server.js').matchAll(/pathname === '(\/api\/[^']*)'/g)) routes.add(m[1])
for (const m of read('api/src/live.js').matchAll(/path: '(\/api\/[^']*)'/g)) routes.add(m[1])
for (const r of routes) expect(r, 'api-pad')

if (missing.length) {
  console.error('README.md is niet up-to-date. Ontbreekt in kbc-loop/README.md:')
  for (const m of missing) console.error(`  - ${m}`)
  console.error('Vul de README aan (bv. in het blok "Opbouw" of de api-tabel) en draai opnieuw: npm run check:readme')
  process.exit(1)
}
console.log('README is up-to-date')
