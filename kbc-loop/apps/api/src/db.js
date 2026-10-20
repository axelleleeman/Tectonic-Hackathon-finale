// SQLite-database (ingebouwd in Node via node:sqlite). Eén rij met de gedeelde demo-state
// en een logboek van alle acties. Web en app praten via de api met deze ene database.
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { createInitialState, loopReducer } from '@kbc-loop/shared/state/loopReducer.js'
import { openCatalog } from './catalog.js'

export function openDb(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true, mode: 0o700 })
  const db = new DatabaseSync(path)
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS loop_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      version INTEGER NOT NULL,
      state TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS action_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL,
      type TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `)

  // Partner catalogue (tables partners + products), seeded from the shared data when empty
  const catalog = openCatalog(db)

  const select = db.prepare('SELECT version, state FROM loop_state WHERE id = 1')
  const upsert = db.prepare(`INSERT INTO loop_state (id, version, state, updated_at) VALUES (1, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET version = excluded.version, state = excluded.state, updated_at = excluded.updated_at`)
  const log = db.prepare('INSERT INTO action_log (version, type, payload, created_at) VALUES (?, ?, ?, ?)')
  const recent = db.prepare('SELECT version, type, payload, created_at FROM action_log ORDER BY id DESC LIMIT ?')

  function read() {
    const row = select.get()
    if (!row) {
      const state = createInitialState()
      upsert.run(1, JSON.stringify(state), new Date().toISOString())
      return { version: 1, state }
    }
    // Nieuwe velden in createInitialState aanvullen voor state die al bewaard was
    return { version: row.version, state: { ...createInitialState(), ...JSON.parse(row.state) } }
  }

  return {
    read,
    catalog,

    // Actie toepassen in één transactie: lezen, reducer, wegschrijven, loggen.
    apply(action) {
      db.exec('BEGIN IMMEDIATE')
      try {
        const current = read()
        const state = loopReducer(current.state, action)
        const version = current.version + 1
        const now = new Date().toISOString()
        upsert.run(version, JSON.stringify(state), now)
        const { type, ...payload } = action
        log.run(version, type, JSON.stringify(payload), now)
        db.exec('COMMIT')
        return { version, state }
      } catch (err) {
        db.exec('ROLLBACK')
        throw err
      }
    },

    recentActions(limit = 20) {
      return recent.all(limit).map((r) => ({ ...r, payload: JSON.parse(r.payload) }))
    },

    // Readiness probe: true when the database answers a trivial query.
    ping() {
      try { return db.prepare('SELECT 1 AS ok').get().ok === 1 } catch { return false }
    },

    close: () => db.close(),
  }
}
