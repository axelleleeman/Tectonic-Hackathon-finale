import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createInitialState, loopReducer } from '../src/state/loopReducer.js'
import { COINS } from '../src/config/index.js'

const run = (...actions) => actions.reduce(loopReducer, createInitialState())

test('lenen voegt een item toe en toont de bevestiging', () => {
  const s = run({ type: 'BORROW', productId: 'phone' })
  assert.equal(s.screen, 'done')
  assert.equal(s.items.lotte.length, 2)
})

test('een bundel lenen voegt elk product apart toe', () => {
  const s = run({ type: 'SWITCH_CUSTOMER', customerId: 'jonas' }, { type: 'BORROW', productId: 'bundle-home' })
  assert.deepEqual(s.items.jonas.map((i) => i.productId), ['lamp-home', 'washer', 'fridge'])
  assert.equal(new Set(s.items.jonas.map((i) => i.key)).size, 3)
})

test('herstelling doorloopt 3 stappen en levert Kate Coins op', () => {
  const s = run(
    { type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: 'Lamp flikkert' },
    { type: 'ADVANCE_REPAIR', itemKey: 'lotte-0' },
    { type: 'ADVANCE_REPAIR', itemKey: 'lotte-0' },
    { type: 'ADVANCE_REPAIR', itemKey: 'lotte-0' }, // mag niet verder dan stap 3
  )
  const lamp = s.items.lotte[0]
  assert.equal(lamp.repair.step, 3)
  assert.equal(lamp.repairs, 2)
  assert.equal(s.coins.lotte, COINS.repair)
})

test('preventieve herstelling start bij stap 2 en wist de toestelmelding', () => {
  let s = run({ type: 'TRIGGER_TELEMETRY' }, { type: 'REPORT_DEFECT', itemKey: 'lotte-0', issue: 'x', preventive: true })
  assert.equal(s.items.lotte[0].repair.step, 2)
  s = loopReducer(s, { type: 'ADVANCE_REPAIR', itemKey: 'lotte-0' })
  assert.equal(s.telemetry.lotte, false)
})

test('inleveren markeert het item en beloont de klant', () => {
  const s = run({ type: 'RETURN_ITEM', itemKey: 'lotte-0' })
  assert.equal(s.items.lotte[0].returned, true)
  assert.equal(s.coins.lotte, COINS.return)
})

test('acties raken enkel de actieve klant', () => {
  const s = run({ type: 'SWITCH_CUSTOMER', customerId: 'peeters' }, { type: 'BORROW', productId: 'lamp-shop' })
  assert.equal(s.items.lotte.length, 1)
  assert.equal(s.items.peeters.length, 1)
})
