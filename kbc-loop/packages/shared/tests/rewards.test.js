import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ACTION_TYPES, PARTNER_REPAIR_STATUSES, SCREENS, createInitialState, loopReducer } from '../src/state/loopReducer.js'
import { bindActions } from '../src/state/actions.js'
import { rewardById, rewards } from '../src/data/rewards.js'
import { customers } from '../src/data/customers.js'
import { COINS, TODAY } from '../src/config/index.js'

const run = (...actions) => actions.reduce(loopReducer, createInitialState())

test('the initial coin balance comes from the customer seed', () => {
  const s = createInitialState()
  for (const c of customers) assert.equal(s.coins[c.id], c.coins ?? 0)
  assert.equal(s.coins.lotte, 350)
  assert.deepEqual(s.redemptions.lotte, [])
  assert.ok(SCREENS.includes('rewards') && SCREENS.includes('inbox'))
})

test('rewards have unique ids and positive costs', () => {
  assert.equal(new Set(rewards.map((r) => r.id)).size, rewards.length)
  assert.ok(rewards.every((r) => Number.isInteger(r.cost) && r.cost > 0))
  assert.equal(rewardById('plant-tree').cost, 150)
  assert.equal(rewardById('nope'), undefined)
})

test('redeeming a reward spends coins and records the redemption', () => {
  const start = createInitialState()
  const s = loopReducer(start, { type: 'REDEEM_REWARD', rewardId: 'plant-tree' })
  assert.equal(s.coins.lotte, start.coins.lotte - 150)
  assert.deepEqual(s.redemptions.lotte, [{ id: `lotte-r-${start.seq}`, rewardId: 'plant-tree', on: TODAY }])
  const twice = loopReducer(s, { type: 'REDEEM_REWARD', rewardId: 'plant-tree' })
  assert.equal(twice.redemptions.lotte.length, 2)
  assert.notEqual(twice.redemptions.lotte[0].id, twice.redemptions.lotte[1].id)
})

test('invalid or unaffordable redemptions leave the state untouched', () => {
  const s = createInitialState()
  assert.equal(loopReducer(s, { type: 'REDEEM_REWARD', rewardId: 'free-upgrade' }), s) // 800 > 350
  assert.equal(loopReducer(s, { type: 'REDEEM_REWARD', rewardId: 'unknown' }), s)
  assert.equal(loopReducer(s, { type: 'REDEEM_REWARD', rewardId: { id: 'plant-tree' } }), s)
  const jonas = loopReducer(s, { type: 'SWITCH_CUSTOMER', customerId: 'jonas' })
  assert.equal(loopReducer(jonas, { type: 'REDEEM_REWARD', rewardId: 'plant-tree' }), jonas)
})

test('redeeming works on state persisted without redemptions', () => {
  const old = createInitialState()
  delete old.redemptions
  const s = loopReducer(old, { type: 'REDEEM_REWARD', rewardId: 'plant-tree' })
  assert.equal(s.redemptions.lotte.length, 1)
})

test('marking notifications as read is validated and idempotent', () => {
  const s = createInitialState()
  const read = loopReducer(s, { type: 'MARK_NOTIFICATIONS_READ', ids: ['a', 'b', 'a'] })
  assert.deepEqual(read.readNotifications.lotte, ['a', 'b'])
  assert.equal(loopReducer(read, { type: 'MARK_NOTIFICATIONS_READ', ids: ['a'] }), read)
  assert.equal(loopReducer(s, { type: 'MARK_NOTIFICATIONS_READ', ids: 'a' }), s)
  assert.equal(loopReducer(s, { type: 'MARK_NOTIFICATIONS_READ', ids: ['x'.repeat(65)] }), s)
  assert.equal(loopReducer(s, { type: 'MARK_NOTIFICATIONS_READ', ids: [1] }), s)
  assert.equal(loopReducer(s, { type: 'MARK_NOTIFICATIONS_READ', ids: Array.from({ length: 101 }, (_, n) => `n${n}`) }), s)
  const old = createInitialState()
  delete old.readNotifications
  assert.deepEqual(loopReducer(old, { type: 'MARK_NOTIFICATIONS_READ', ids: ['a'] }).readNotifications.lotte, ['a'])
})

test('a partner updates the repair status of any customer', () => {
  let s = run({ type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: 'Light flickers' }, { type: 'SWITCH_CUSTOMER', customerId: 'jonas' })
  const coins = s.coins.lotte
  s = loopReducer(s, { type: 'PARTNER_UPDATE_REPAIR', customerId: 'lotte', itemKey: 'lotte-0', status: 'on-the-way' })
  assert.deepEqual(
    { step: s.items.lotte[0].repair.step, partnerStatus: s.items.lotte[0].repair.partnerStatus, updatedOn: s.items.lotte[0].repair.updatedOn },
    { step: 2, partnerStatus: 'on-the-way', updatedOn: TODAY },
  )
  s = loopReducer(s, { type: 'PARTNER_UPDATE_REPAIR', customerId: 'lotte', itemKey: 'lotte-0', status: 'repaired' })
  assert.equal(s.items.lotte[0].repair.step, 3)
  assert.equal(s.items.lotte[0].repairs, 2)
  assert.equal(s.coins.lotte, coins + COINS.repair)
  assert.equal(s.customerId, 'jonas')
  const again = loopReducer(s, { type: 'PARTNER_UPDATE_REPAIR', customerId: 'lotte', itemKey: 'lotte-0', status: 'repaired' })
  assert.equal(again.coins.lotte, s.coins.lotte) // rewarded once
  assert.deepEqual(PARTNER_REPAIR_STATUSES, ['scheduled', 'on-the-way', 'in-progress', 'repaired'])
})

test('invalid partner updates leave the state untouched', () => {
  const s = run({ type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: 'x' })
  const upd = (extra) => loopReducer(s, { type: 'PARTNER_UPDATE_REPAIR', customerId: 'lotte', itemKey: 'lotte-0', status: 'scheduled', ...extra })
  assert.equal(upd({ status: 'done' }), s)
  assert.equal(upd({ customerId: 'nobody' }), s)
  assert.equal(upd({ customerId: { id: 'lotte' } }), s)
  assert.equal(upd({ itemKey: 'lotte-1' }), s) // no open repair
  assert.equal(upd({ itemKey: ['lotte-0'] }), s)
  assert.notEqual(upd({ customerId: undefined }), s) // defaults to the active customer
})

test('bound reward, inbox and partner actions', () => {
  const sent = []
  const a = bindActions((x) => sent.push(x))
  a.redeemReward('plant-tree')
  a.markNotificationsRead(['n1'])
  a.partnerUpdateRepair('lotte-0', 'scheduled')
  a.partnerUpdateRepair('lotte-0', 'repaired', 'lotte')
  assert.deepEqual(sent, [
    { type: 'REDEEM_REWARD', rewardId: 'plant-tree' },
    { type: 'MARK_NOTIFICATIONS_READ', ids: ['n1'] },
    { type: 'PARTNER_UPDATE_REPAIR', itemKey: 'lotte-0', status: 'scheduled' },
    { type: 'PARTNER_UPDATE_REPAIR', itemKey: 'lotte-0', status: 'repaired', customerId: 'lotte' },
  ])
  assert.ok(sent.every((x) => ACTION_TYPES.includes(x.type)))
})
