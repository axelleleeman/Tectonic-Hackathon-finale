import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createInitialState, loopReducer } from '../src/state/loopReducer.js'
import { derive, notificationsFor, unreadCount } from '../src/state/derive.js'
import { campaignSignalId } from '../src/engine/rules.js'

const run = (...actions) => actions.reduce(loopReducer, createInitialState())
const campaign = { type: 'START_CAMPAIGN', segmentId: 'seg-phone-repair', message: 'Rent a phone with free repairs.' }
const level = (kateLevel) => ({ type: 'SET_DATA_PREFERENCES', preferences: { kateLevel } })
// Partner campaign tips only reach customers on the 'ecosystem' Kate level
const runEco = (...actions) => run(level('ecosystem'), ...actions)

test('a running campaign gives matching customers with consent a Kate tip', () => {
  const s = runEco(campaign)
  const tip = derive(s).signals.find((x) => x.id === campaignSignalId('seg-phone-repair'))
  assert.equal(tip.headline, 'Rent a phone with free repairs.')
  assert.equal(tip.productId, 'phone')
  assert.deepEqual(tip.campaign, { segmentId: 'seg-phone-repair' })
  assert.ok(tip.reasons.length > 0)
})

test('a campaign without a message uses the default text', () => {
  const tip = derive(runEco({ type: 'TOGGLE_CAMPAIGN', segmentId: 'seg-phone-repair' })).signals.find((x) => x.campaign)
  assert.match(tip.headline, /repairs are always included/)
})

test('campaign tips respect consent, segment, dismissal and stopping', () => {
  const has = (s) => derive(s).signals.some((x) => x.campaign)
  assert.equal(has(runEco(campaign, { type: 'SET_CONSENT', value: false })), false)
  assert.equal(has(runEco(campaign, { type: 'SWITCH_CUSTOMER', customerId: 'jonas' })), false)
  assert.equal(has(runEco(campaign, { type: 'DISMISS_SIGNAL', signalId: campaignSignalId('seg-phone-repair') })), false)
  assert.equal(has(runEco(campaign, { type: 'STOP_CAMPAIGN', segmentId: 'seg-phone-repair' })), false)
  assert.equal(has(runEco(campaign, { type: 'BORROW', productId: 'phone' })), false) // already borrows the product
  assert.equal(has(runEco(campaign)), true)
})

test('the washing machine campaign reaches Sarah through her repair payments', () => {
  const s = run({ type: 'START_CAMPAIGN', segmentId: 'seg-washer-repair' }, { type: 'SWITCH_CUSTOMER', customerId: 'sarah' }, level('ecosystem'))
  assert.equal(derive(s).signals.find((x) => x.campaign)?.productId, 'washer')
})

test('notifications are derived from repairs, tips, campaigns and rewards', () => {
  const s = runEco(campaign, { type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: 'Flickers' }, { type: 'REDEEM_REWARD', rewardId: 'plant-tree' })
  const list = notificationsFor(s)
  const kinds = new Set(list.map((n) => n.kind))
  for (const k of ['repair', 'campaign', 'tip', 'reward']) assert.ok(kinds.has(k), k)
  assert.equal(new Set(list.map((n) => n.id)).size, list.length)
  assert.ok(list.every((n) => n.id.length <= 64 && n.title && n.body && n.date && n.target.screen && n.read === false))
  assert.deepEqual(list.find((n) => n.kind === 'repair').target, { screen: 'repair', active: { itemKey: 'lotte-0' } })
  for (let i = 1; i < list.length; i++) assert.ok(list[i - 1].date >= list[i].date) // newest first
  assert.deepEqual(notificationsFor(s), list) // deterministic
})

test('a partner status change creates a new repair notification', () => {
  const s = run({ type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: 'x' })
  const before = notificationsFor(s).find((n) => n.kind === 'repair')
  const after = notificationsFor(loopReducer(s, { type: 'PARTNER_UPDATE_REPAIR', itemKey: 'lotte-0', status: 'on-the-way' })).find((n) => n.kind === 'repair')
  assert.notEqual(before.id, after.id)
  assert.equal(after.title, 'Technician on the way')
})

test('marking notifications as read updates the unread count', () => {
  const s = run(campaign)
  const ids = notificationsFor(s).map((n) => n.id)
  assert.ok(unreadCount(s) > 0)
  const read = loopReducer(s, { type: 'MARK_NOTIFICATIONS_READ', ids })
  assert.equal(unreadCount(read), 0)
  assert.ok(notificationsFor(read).every((n) => n.read))
})

test('Kate level basic: no proactive tips or tip notifications, other notifications stay', () => {
  const s = runEco(campaign, level('basic'), { type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: 'Flickers' })
  assert.equal(derive(s).dataPreferences.kateLevel, 'basic')
  assert.deepEqual(derive(s).signals, [])
  const kinds = new Set(notificationsFor(s).map((n) => n.kind))
  assert.ok(kinds.has('repair'))
  assert.ok(!kinds.has('tip') && !kinds.has('campaign'))
})

test('Kate level proactive (default): tips, but no campaign tips', () => {
  const s = run(campaign)
  assert.equal(derive(s).dataPreferences.kateLevel, 'proactive')
  assert.ok(derive(s).signals.length > 0)
  assert.ok(!derive(s).signals.some((x) => x.campaign))
  const kinds = new Set(notificationsFor(s).map((n) => n.kind))
  assert.ok(kinds.has('tip') && !kinds.has('campaign'))
})

test('Kate level ecosystem: tips including campaign tips', () => {
  const s = runEco(campaign)
  assert.ok(derive(s).signals.some((x) => x.campaign))
  assert.ok(derive(s).signals.some((x) => !x.campaign))
  const kinds = new Set(notificationsFor(s).map((n) => n.kind))
  assert.ok(kinds.has('tip') && kinds.has('campaign'))
})

test('no consent means no tips on any Kate level', () => {
  for (const l of ['basic', 'proactive', 'ecosystem']) {
    const s = run(campaign, level(l), { type: 'SET_CONSENT', value: false })
    assert.ok(!derive(s).signals.some((x) => x.source === 'transacties'), l)
    assert.ok(!notificationsFor(s).some((n) => n.kind === 'campaign'), l)
  }
})
