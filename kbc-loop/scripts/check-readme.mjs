// Checks that README.md describes the actual project structure.
// Usage: npm run check:readme (also runs as part of npm test).
//   1. every app (apps/*) and package (packages/*), their subfolders in src/, and every file in apps/api/src
//   2. every npm script in package.json
//   3. every API path in apps/api/src/server.js and the WebSocket path in apps/api/src/live.js
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const read = (p) => readFileSync(join(root, p), 'utf8')
const readme = read('README.md')
const IGNORE = new Set(['node_modules', 'dist', '.expo', 'assets'])

const missing = []
const expect = (name, what) => { if (!readme.includes(name)) missing.push(`${what}: ${name}`) }

const entries = (dir) => (existsSync(join(root, dir)) ? readdirSync(join(root, dir), { withFileTypes: true }) : [])

// 1. Folders and files
// Workspaces are globs such as "apps/*" and "packages/*": every folder below them is an app or package.
const workspaces = (JSON.parse(read('package.json')).workspaces ?? []).flatMap((ws) => (ws.endsWith('/*')
  ? entries(ws.slice(0, -2)).filter((e) => e.isDirectory() && !e.name.startsWith('.')).map((e) => `${ws.slice(0, -2)}/${e.name}`)
  : [ws]))
for (const ws of workspaces) {
  expect(`${ws.split('/').pop()}/`, 'app or package folder')
  for (const e of entries(`${ws}/src`)) {
    if (e.isDirectory() && !IGNORE.has(e.name) && !e.name.startsWith('.')) expect(`${e.name}/`, `folder in ${ws}/src`)
  }
}
for (const e of entries('apps/api/src')) if (e.isFile()) expect(e.name, 'file in apps/api/src')

// 2. npm scripts
for (const name of Object.keys(JSON.parse(read('package.json')).scripts ?? {})) expect(name, 'npm script')

// 3. API paths
const routes = new Set()
for (const m of read('apps/api/src/server.js').matchAll(/pathname === '(\/api\/[^']*)'/g)) routes.add(m[1])
for (const m of read('apps/api/src/live.js').matchAll(/path: '(\/api\/[^']*)'/g)) routes.add(m[1])
for (const r of routes) expect(r, 'API path')

if (missing.length) {
  console.error('README.md is out of date. Missing from kbc-loop/README.md:')
  for (const m of missing) console.error(`  - ${m}`)
  console.error('Update the README (e.g. the structure block or the API table) and run again: npm run check:readme')
  process.exit(1)
}
console.log('README is up-to-date')
