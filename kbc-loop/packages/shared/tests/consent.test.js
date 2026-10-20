import { test } from 'node:test'
import assert from 'node:assert/strict'
import { KATE_LEVELS, SCREENS, createInitialState, loopReducer } from '../src/state/loopReducer.js'
import { bindActions } from '../src/state/actions.js'
import { derive } from '../src/state/derive.js'
import { TODAY } from '../src/config/index.js'

const run = (...actions) => actions.reduce(loopReducer, createInitialState())

test('data preferences start privacy-friendly and not completed', () => {
  const p = createInitialState().dataPreferences.lotte
  assert.deepEqual(p, { kateTips: true, insights: false, partners: false, telemetry: false, kateLevel: 'proactive', completedOn: null })
  assert.ok(SCREENS.includes('consent'))
})

test('SET_DATA_PREFERENCES saves known booleans, completes the profile and syncs consent', () => {
  const s = run({ type: 'SET_DATA_PREFERENCES', preferences: { kateTips: false, insights: true, partners: true, telemetry: false } })
  assert.deepEqual(s.dataPreferences.lotte, { kateTips: false, insights: true, partners: true, telemetry: false, kateLevel: 'proactive', completedOn: TODAY })
  assert.equal(s.consent, false)
  assert.equal(derive(s).dataPreferences.completedOn, TODAY)
})

test('a partial update keeps other preferences and leaves consent alone', () => {
  const s = run({ type: 'SET_DATA_PREFERENCES', preferences: { insights: true } })
  assert.equal(s.dataPreferences.lotte.insights, true)
  assert.equal(s.dataPreferences.lotte.kateTips, true)
  assert.equal(s.consent, true)
})

test('invalid data preferences return the same state object', () => {
  const s = createInitialState()
  for (const preferences of [undefined, null, [], {}, { insights: 'yes' }, { admin: true }, { insights: true, extra: false },
    { kateLevel: 'max' }, { kateLevel: '' }, { kateLevel: true }, { kateLevel: null }, { kateLevel: ['basic'] }, { kateLevel: 'Basic' }, { kateLevel: 'basic', admin: true }]) {
    assert.equal(loopReducer(s, { type: 'SET_DATA_PREFERENCES', preferences }), s)
  }
})

test('SET_CONSENT keeps kateTips in sync', () => {
  const s = run({ type: 'SET_CONSENT', value: false })
  assert.equal(s.consent, false)
  assert.equal(s.dataPreferences.lotte.kateTips, false)
  assert.equal(s.dataPreferences.lotte.completedOn, null)
})

test('older persisted state without dataPreferences is tolerated', () => {
  const old = createInitialState()
  delete old.dataPreferences
  assert.equal(derive(old).dataPreferences.completedOn, null)
  const s = loopReducer(old, { type: 'SET_DATA_PREFERENCES', preferences: { telemetry: true } })
  assert.equal(s.dataPreferences.lotte.telemetry, true)
  assert.equal(s.dataPreferences.lotte.completedOn, TODAY)
})

test('setDataPreferences dispatches the action', () => {
  const sent = []
  bindActions((a) => sent.push(a)).setDataPreferences({ insights: true })
  assert.deepEqual(sent, [{ type: 'SET_DATA_PREFERENCES', preferences: { insights: true } }])
})

test('SET_DATA_PREFERENCES accepts the three Kate levels and keeps the other choices', () => {
  assert.deepEqual(KATE_LEVELS.map((l) => l.id), ['basic', 'proactive', 'ecosystem'])
  assert.ok(KATE_LEVELS.every((l) => l.label && l.line))
  for (const kateLevel of ['basic', 'ecosystem', 'proactive']) {
    const s = run({ type: 'SET_DATA_PREFERENCES', preferences: { kateLevel } })
    assert.equal(s.dataPreferences.lotte.kateLevel, kateLevel)
    assert.equal(s.dataPreferences.lotte.kateTips, true)
    assert.equal(s.consent, true)
    assert.equal(derive(s).dataPreferences.kateLevel, kateLevel)
  }
})

test('older state without kateLevel (or with an unknown one) reads as proactive', () => {
  const old = createInitialState()
  delete old.dataPreferences.lotte.kateLevel
  assert.equal(derive(old).dataPreferences.kateLevel, 'proactive')
  old.dataPreferences.lotte.kateLevel = 'everything'
  assert.equal(derive(old).dataPreferences.kateLevel, 'proactive')
})
