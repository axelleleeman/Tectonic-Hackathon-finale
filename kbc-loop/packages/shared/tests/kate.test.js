import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  KATE_TEXT, answerIntent, capabilitiesReply, detectIntent, greeting, respond, suggestions, voiceNotAvailableReply,
} from '../src/kate/index.js'

const lamp = { key: 'lotte-0', productId: 'lamp-home', repair: null, returned: false }
const inRepair = { ...lamp, key: 'lotte-1', repair: { step: 1 } }
const returned = { ...lamp, key: 'lotte-2', returned: true }
const tipSignal = { id: 'phone-repair', productId: 'phone' }

test('the greeting uses the customer\'s name', () => {
  assert.equal(greeting({ name: 'Lotte' }), 'Hi Lotte. 👋 Kate here, how can I help?')
  assert.match(greeting(null), /^Hi\. /)
})

test('"my lamp is flickering" opens the repair of a fixable item', () => {
  const res = respond('My lamp is flickering', { items: [inRepair, lamp], signals: [] })
  assert.equal(res.reply, KATE_TEXT.openingRepair)
  assert.deepEqual(res.action, { type: 'navigate', screen: 'repair', params: { itemKey: 'lotte-0' } })
})

test('a defect without a fixable item gets a reply but no action', () => {
  const res = respond('something is broken', { items: [inRepair, returned], signals: [] })
  assert.equal(res.reply, KATE_TEXT.nothingToRepair)
  assert.equal(res.action, undefined)
})

test('a tip navigates to the suggested product', () => {
  const res = respond('Any advice?', { items: [], signals: [{ id: 'x' }, tipSignal] })
  assert.deepEqual(res.action, { type: 'navigate', screen: 'product', params: { productId: 'phone', signalId: 'phone-repair' } })
  assert.equal(respond('give me a tip', { items: [], signals: [] }).reply, KATE_TEXT.noTip)
})

test('the overview question navigates to the overview', () => {
  assert.deepEqual(respond('What am I borrowing?', {}).action, { type: 'navigate', screen: 'overview', params: {} })
})

test('capabilities, unknown input and empty input', () => {
  assert.equal(respond('What can you do?', {}).reply, capabilitiesReply())
  assert.deepEqual(respond('hello there', {}), { reply: KATE_TEXT.unknown })
  assert.equal(respond('   ', {}), null)
  assert.equal(answerIntent('nonsense', {}).reply, KATE_TEXT.unknown)
  assert.equal(voiceNotAvailableReply(), KATE_TEXT.noVoice)
})

test('Dutch questions still work through the existing matchIntent', () => {
  assert.equal(detectIntent('Mijn lamp flikkert'), 'defect')
  assert.equal(detectIntent('Wat leen ik nu?'), 'overview')
  assert.equal(detectIntent('hallo'), null)
})

test('the chip list respects items and signals', () => {
  const ids = (list) => list.map((c) => c.id)
  assert.deepEqual(ids(suggestions({ items: [], signals: [] })), ['call-live', 'capabilities', 'overview'])
  assert.deepEqual(ids(suggestions({ items: [lamp], signals: [tipSignal] })), ['call-live', 'capabilities', 'defect', 'tip', 'overview'])
  assert.deepEqual(ids(suggestions({ items: [returned, inRepair], signals: [{ id: 'no-product' }] })), ['call-live', 'capabilities', 'overview'])
  const [call] = suggestions({})
  assert.equal(call.label, '📞 Call KBC Live')
  assert.equal(call.disabled, true)
})
