import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ACTION_TYPES, SCREENS, createInitialState, loopReducer } from '../src/state/loopReducer.js'
import { bindActions } from '../src/state/actions.js'
import { COINS, TODAY } from '../src/config/index.js'

const run = (...actions) => actions.reduce(loopReducer, createInitialState())

test('borrowing adds an item and shows the confirmation', () => {
  const s = run({ type: 'BORROW', productId: 'phone' })
  assert.equal(s.screen, 'done')
  assert.equal(s.items.lotte.length, 2)
})

test('borrowing a bundle adds each product separately', () => {
  const s = run({ type: 'SWITCH_CUSTOMER', customerId: 'jonas' }, { type: 'BORROW', productId: 'bundle-home' })
  assert.deepEqual(s.items.jonas.map((i) => i.productId), ['lamp-home', 'washer', 'fridge'])
  assert.equal(new Set(s.items.jonas.map((i) => i.key)).size, 3)
})

test('a repair goes through 3 steps and earns Kate Coins', () => {
  const s = run(
    { type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: 'Light flickers' },
    { type: 'ADVANCE_REPAIR', itemKey: 'lotte-0' },
    { type: 'ADVANCE_REPAIR', itemKey: 'lotte-0' },
    { type: 'ADVANCE_REPAIR', itemKey: 'lotte-0' }, // cannot go beyond step 3
  )
  const lamp = s.items.lotte[0]
  assert.equal(lamp.repair.step, 3)
  assert.equal(lamp.repairs, 2)
  assert.equal(s.coins.lotte, COINS.repair)
})

test('a preventive repair starts at step 2 and clears the device alert', () => {
  let s = run({ type: 'TRIGGER_TELEMETRY' }, { type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: 'x', preventive: true })
  assert.equal(s.items.lotte[0].repair.step, 2)
  s = loopReducer(s, { type: 'ADVANCE_REPAIR', itemKey: 'lotte-0' })
  assert.equal(s.telemetry.lotte, false)
})

test('a defect report stores a trimmed note and the photo flag', () => {
  const s = run({ type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: '  Light flickers ', note: `  ${'a'.repeat(300)}  `, photo: true })
  const { repair } = s.items.lotte[0]
  assert.equal(repair.issue, 'Light flickers')
  assert.equal(repair.note.length, 200)
  assert.equal(repair.photo, true)
  const plain = run({ type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: 'x', note: 42, photo: 'yes' }).items.lotte[0].repair
  assert.equal(plain.note, null)
  assert.equal(plain.photo, false)
})

test('invalid defect reports are ignored', () => {
  const s = createInitialState()
  assert.equal(loopReducer(s, { type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: '   ' }), s)
  assert.equal(loopReducer(s, { type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: { evil: 1 } }), s)
  assert.equal(loopReducer(s, { type: 'REPORT_DEFECT', itemKey: 'nobody-9', issue: 'x' }), s)
  const back = loopReducer(s, { type: 'RETURN_ITEM', itemKey: 'lotte-0' })
  assert.equal(loopReducer(back, { type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: 'x' }), back)
})

test('returning marks the item, records the date and rewards the customer once', () => {
  const s = run({ type: 'RETURN_ITEM', itemKey: 'lotte-0' })
  assert.equal(s.items.lotte[0].returned, true)
  assert.equal(s.items.lotte[0].returnedOn, TODAY)
  assert.equal(s.coins.lotte, COINS.return)
  assert.equal(loopReducer(s, { type: 'RETURN_ITEM', itemKey: 'lotte-0' }), s)
  assert.equal(loopReducer(s, { type: 'RETURN_ITEM', itemKey: 'unknown' }), s)
})

test('upgrading returns the old item and adds the new one atomically', () => {
  const s = run({ type: 'BORROW', productId: 'phone' }, { type: 'UPGRADE_ITEM', itemKey: 'lotte-new-0', productId: 'phone-pro' })
  const [, old, upgraded] = s.items.lotte
  assert.equal(old.returned, true)
  assert.equal(old.returnedOn, TODAY)
  assert.equal(old.repair, null)
  assert.deepEqual(
    { productId: upgraded.productId, since: upgraded.since, repairs: upgraded.repairs, returned: upgraded.returned, upgradedFrom: upgraded.upgradedFrom },
    { productId: 'phone-pro', since: TODAY, repairs: 0, returned: false, upgradedFrom: 'lotte-new-0' },
  )
  assert.equal(new Set(s.items.lotte.map((i) => i.key)).size, 3)
  assert.equal(s.coins.lotte, COINS.return)
  assert.equal(s.screen, 'item')
  assert.equal(s.active.itemKey, upgraded.key)
})

test('invalid upgrades leave the state untouched', () => {
  const s = run({ type: 'BORROW', productId: 'phone' })
  assert.equal(loopReducer(s, { type: 'UPGRADE_ITEM', itemKey: 'lotte-new-0', productId: 'phone-essential' }), s) // cheaper
  assert.equal(loopReducer(s, { type: 'UPGRADE_ITEM', itemKey: 'lotte-new-0', productId: 'washer' }), s) // other category
  assert.equal(loopReducer(s, { type: 'UPGRADE_ITEM', itemKey: 'lotte-new-0', productId: 'phone-fleet' }), s) // business only
  assert.equal(loopReducer(s, { type: 'UPGRADE_ITEM', itemKey: 'nope', productId: 'phone-pro' }), s)
  assert.equal(loopReducer(s, { type: 'UPGRADE_ITEM', itemKey: 'lotte-new-0', productId: ['phone-pro'] }), s)
  const back = loopReducer(s, { type: 'RETURN_ITEM', itemKey: 'lotte-new-0' })
  assert.equal(loopReducer(back, { type: 'UPGRADE_ITEM', itemKey: 'lotte-new-0', productId: 'phone-pro' }), back)
})

test('the item and costs screens are navigable', () => {
  assert.ok(SCREENS.includes('item') && SCREENS.includes('costs'))
  const s = run({ type: 'NAVIGATE', screen: 'item', active: { itemKey: 'lotte-0' } })
  assert.equal(s.screen, 'item')
  assert.equal(s.active.itemKey, 'lotte-0')
  assert.equal(run({ type: 'NAVIGATE', screen: 'costs' }).screen, 'costs')
})

test('actions only affect the active customer', () => {
  const s = run({ type: 'SWITCH_CUSTOMER', customerId: 'peeters' }, { type: 'BORROW', productId: 'lamp-shop' })
  assert.equal(s.items.lotte.length, 1)
  assert.equal(s.items.peeters.length, 1)
})

test('toggling a campaign from KBC Loop Insights', () => {
  const on = run({ type: 'TOGGLE_CAMPAIGN', segmentId: 'seg-phone-repair' })
  assert.deepEqual(on.campaigns, ['seg-phone-repair'])
  assert.deepEqual(loopReducer(on, { type: 'TOGGLE_CAMPAIGN', segmentId: 'seg-phone-repair' }).campaigns, [])
})

test('invalid actions leave the state untouched', () => {
  const s = createInitialState()
  assert.equal(loopReducer(s, { type: 'NAVIGATE', screen: 'does-not-exist' }), s)
  assert.equal(loopReducer(s, { type: 'SWITCH_CUSTOMER', customerId: 'nobody' }), s)
  assert.equal(loopReducer(s, { type: 'SET_VIEW', view: 'hacker' }), s)
  assert.equal(loopReducer(s, { type: 'BORROW', productId: 'unknown' }), s)
  assert.equal(loopReducer(s, { type: 'TOGGLE_CAMPAIGN', segmentId: 'x'.repeat(5000) }), s)
  assert.equal(loopReducer(s, { type: 'DISMISS_SIGNAL', signalId: { evil: 1 } }), s)
  assert.equal(loopReducer(s, { type: 'ADVANCE_REPAIR', itemKey: 'lotte-0' }), s)
  assert.equal(loopReducer(s, { type: 'CLOSE_REPAIR', itemKey: 'nope' }), s)
  assert.equal(loopReducer(s, null), s)
  const n = loopReducer(s, { type: 'NAVIGATE', screen: 'shop', active: { evil: 1, categoryId: 'energie', itemKey: { x: 1 } } })
  assert.deepEqual(Object.keys(n.active).sort(), ['categoryId', 'itemKey', 'productId', 'signalId'])
  assert.equal(n.active.itemKey, null)
})

test('state persisted before new fields existed still works', () => {
  const old = createInitialState()
  delete old.items.jonas
  delete old.coins.jonas
  const s = [{ type: 'SWITCH_CUSTOMER', customerId: 'jonas' }, { type: 'BORROW', productId: 'phone' }, { type: 'RETURN_ITEM', itemKey: 'jonas-new-0' }]
    .reduce(loopReducer, old)
  assert.equal(s.items.jonas[0].returned, true)
  assert.equal(s.coins.jonas, COINS.return)
})

test('bound actions dispatch every action type the api accepts', () => {
  const sent = []
  const a = bindActions((x) => sent.push(x))
  a.upgradeItem('lotte-0', 'solar-balcony')
  a.reportDefect('lotte-0', 'Light flickers')
  a.reportDefect('lotte-0', 'Light flickers', false, 'Kitchen', true)
  assert.deepEqual(sent[0], { type: 'UPGRADE_ITEM', itemKey: 'lotte-0', productId: 'solar-balcony' })
  assert.deepEqual(sent[1], { type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: 'Light flickers', preventive: false, note: null, photo: false })
  assert.equal(sent[2].note, 'Kitchen')
  assert.ok(sent.every((x) => ACTION_TYPES.includes(x.type)))
})

test('starting a campaign stores validated details', () => {
  const s = run({ type: 'START_CAMPAIGN', segmentId: 'seg-phone-repair', audience: 'consented-active', budget: 250000, message: `  ${'Hi '.repeat(200)}` })
  assert.deepEqual(s.campaigns, ['seg-phone-repair'])
  const d = s.campaignDetails['seg-phone-repair']
  assert.equal(d.segmentId, 'seg-phone-repair')
  assert.equal(d.audience, 'consented-active')
  assert.equal(d.budget, 100000)
  assert.equal(d.message.length, 280)
  assert.equal(d.message, d.message.trim())
  assert.deepEqual({ channel: d.channel, startedOn: d.startedOn, status: d.status }, { channel: 'kate', startedOn: TODAY, status: 'running' })
  assert.equal(run({ type: 'START_CAMPAIGN', segmentId: 'seg-baby', budget: -5 }).campaignDetails['seg-baby'].budget, 0)
})

test('stopping a campaign keeps its details with status stopped', () => {
  const on = run({ type: 'START_CAMPAIGN', segmentId: 'seg-baby', budget: 500, message: 'Borrow instead of buy' })
  const off = loopReducer(on, { type: 'STOP_CAMPAIGN', segmentId: 'seg-baby' })
  assert.deepEqual(off.campaigns, [])
  assert.equal(off.campaignDetails['seg-baby'].status, 'stopped')
  assert.equal(off.campaignDetails['seg-baby'].budget, 500)
  assert.equal(loopReducer(off, { type: 'STOP_CAMPAIGN', segmentId: 'seg-baby' }), off)
})

test('toggling a campaign starts it with defaults and stops it', () => {
  const on = run({ type: 'TOGGLE_CAMPAIGN', segmentId: 'seg-phone-repair' })
  assert.deepEqual(on.campaignDetails['seg-phone-repair'], {
    segmentId: 'seg-phone-repair', audience: 'consented', budget: 0, message: '', channel: 'kate', startedOn: TODAY, status: 'running',
  })
  assert.equal(loopReducer(on, { type: 'TOGGLE_CAMPAIGN', segmentId: 'seg-phone-repair' }).campaignDetails['seg-phone-repair'].status, 'stopped')
})

test('invalid campaigns are ignored', () => {
  const s = createInitialState()
  const start = (extra) => loopReducer(s, { type: 'START_CAMPAIGN', segmentId: 'seg-phone-repair', ...extra })
  assert.equal(start({ segmentId: 'unknown' }), s)
  assert.equal(start({ segmentId: 'seg-cargo-repair' }), s) // group too small to show (anonymity)
  assert.equal(start({ audience: 'everyone' }), s)
  assert.equal(start({ budget: '100' }), s)
  assert.equal(start({ budget: Number.NaN }), s)
  assert.equal(start({ message: { html: '<script>' } }), s)
  assert.equal(loopReducer(s, { type: 'TOGGLE_CAMPAIGN', segmentId: 'seg-cargo-repair' }), s)
  assert.equal(loopReducer(s, { type: 'STOP_CAMPAIGN', segmentId: 'seg-phone-repair' }), s)
})

test('campaign actions on state persisted without campaign details', () => {
  const old = createInitialState()
  delete old.campaignDetails
  old.campaigns = ['seg-phone-repair']
  const off = loopReducer(old, { type: 'STOP_CAMPAIGN', segmentId: 'seg-phone-repair' })
  assert.deepEqual(off.campaigns, [])
  assert.deepEqual(off.campaignDetails, {})
  assert.ok(loopReducer(old, { type: 'START_CAMPAIGN', segmentId: 'seg-baby' }).campaignDetails['seg-baby'])
})

test('bound campaign actions', () => {
  const sent = []
  const a = bindActions((x) => sent.push(x))
  a.startCampaign('seg-baby', { audience: 'consented', budget: 100, message: 'Hi' })
  a.stopCampaign('seg-baby')
  assert.deepEqual(sent, [
    { type: 'START_CAMPAIGN', segmentId: 'seg-baby', audience: 'consented', budget: 100, message: 'Hi' },
    { type: 'STOP_CAMPAIGN', segmentId: 'seg-baby' },
  ])
  assert.ok(sent.every((x) => ACTION_TYPES.includes(x.type)))
})
