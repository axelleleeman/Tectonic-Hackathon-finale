import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createInitialState, loopReducer } from '../src/state/loopReducer.js'
import { derive, notificationsFor, unreadCount } from '../src/state/derive.js'
import { campaignSignalId } from '../src/engine/rules.js'

const run = (...actions) => actions.reduce(loopReducer, createInitialState())
const campaign = { type: 'START_CAMPAIGN', segmentId: 'seg-phone-repair', message: 'Rent a phone with free repairs.' }

test('a running campaign gives matching customers with consent a Kate tip', () => {
  const s = run(campaign)
  const tip = derive(s).signals.find((x) => x.id === campaignSignalId('seg-phone-repair'))
  assert.equal(tip.headline, 'Rent a phone with free repairs.')
  assert.equal(tip.productId, 'phone')
  assert.deepEqual(tip.campaign, { segmentId: 'seg-phone-repair' })
  assert.ok(tip.reasons.length > 0)
})

test('a campaign without a message uses the default text', () => {
  const tip = derive(run({ type: 'TOGGLE_CAMPAIGN', segmentId: 'seg-phone-repair' })).signals.find((x) => x.campaign)
  assert.match(tip.headline, /repairs are always included/)
})

test('campaign tips respect consent, segment, dismissal and stopping', () => {
  const has = (s) => derive(s).signals.some((x) => x.campaign)
  assert.equal(has(run(campaign, { type: 'SET_CONSENT', value: false })), false)
  assert.equal(has(run(campaign, { type: 'SWITCH_CUSTOMER', customerId: 'jonas' })), false)
  assert.equal(has(run(campaign, { type: 'DISMISS_SIGNAL', signalId: campaignSignalId('seg-phone-repair') })), false)
  assert.equal(has(run(campaign, { type: 'STOP_CAMPAIGN', segmentId: 'seg-phone-repair' })), false)
  assert.equal(has(run(campaign, { type: 'BORROW', productId: 'phone' })), false) // already borrows the product
  assert.equal(has(run(campaign)), true)
})

test('the washing machine campaign reaches Sarah through her repair payments', () => {
  const s = run({ type: 'START_CAMPAIGN', segmentId: 'seg-washer-repair' }, { type: 'SWITCH_CUSTOMER', customerId: 'sarah' })
  assert.equal(derive(s).signals.find((x) => x.campaign)?.productId, 'washer')
})

test('notifications are derived from repairs, tips, campaigns and rewards', () => {
  const s = run(campaign, { type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: 'Flickers' }, { type: 'REDEEM_REWARD', rewardId: 'plant-tree' })
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
