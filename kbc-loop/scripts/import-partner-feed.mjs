// Imports a partner product feed into the KBC Loop database (tables partners + products).
// Usage: npm run import:feed -- <feed.json> [--db path]
//    or: node scripts/import-partner-feed.mjs <feed.json> [--db path]
// Default database: DB_PATH or apps/api/data/kbc-loop.db (same as the api).
// The feed is validated strictly first (apps/api/src/partnerFeed.js); nothing is written when it is invalid.
// The import runs in one transaction and replaces that partner's previous products.
// Import is CLI-only on purpose: the api has no write endpoint for the catalogue.
import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { DatabaseSync } from 'node:sqlite'
import { loadConfig } from '../apps/api/src/config.js'
import { openCatalog } from '../apps/api/src/catalog.js'
import { MAX_FEED_BYTES, validatePartnerFeed } from '../apps/api/src/partnerFeed.js'

const fail = (msg, details = []) => {
  console.error(msg)
  for (const d of details) console.error(`  - ${d}`)
  process.exit(1)
}

let args
try {
  args = parseArgs({ allowPositionals: true, options: { db: { type: 'string' } } })
} catch (err) {
  fail(err.message)
}
if (args.positionals.length !== 1) fail('Usage: node scripts/import-partner-feed.mjs <feed.json> [--db path]')

const feedPath = resolve(args.positionals[0])
const dbPath = args.values.db ? resolve(args.values.db) : loadConfig().dbPath

let input
try {
  if (statSync(feedPath).size > MAX_FEED_BYTES) fail(`Feed is larger than ${MAX_FEED_BYTES / 1024} KB`)
  input = JSON.parse(readFileSync(feedPath, 'utf8'))
} catch (err) {
  fail(`Cannot read feed ${feedPath}: ${err.message}`)
}

const result = validatePartnerFeed(input)
if (!result.ok) fail(`Feed rejected (${result.errors.length} problem(s)):`, result.errors)

const db = new DatabaseSync(dbPath)
try {
  db.exec('PRAGMA journal_mode = WAL')
  const { partnerId, products } = openCatalog(db).importPartnerFeed(result.feed)
  console.log(`Imported partner "${partnerId}" with ${products} product(s) into ${dbPath}`)
} catch (err) {
  fail(`Import failed, nothing was changed: ${err.message}`)
} finally {
  db.close()
}
