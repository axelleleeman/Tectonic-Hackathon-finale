// Afgeleide gegevens uit de gedeelde state (huidige klant, items, signalen …).
// Zonder React, zodat web, app en api dezelfde logica gebruiken.
import { customers } from '../data/index.js'
import { detectSignals } from '../engine/signals.js'
import { productById } from '../engine/catalog.js'
import { upgradeOptions } from '../engine/upgrades.js'
import { rewardById } from '../data/rewards.js'
import { TODAY } from '../config/index.js'
import { defaultDataPreferences } from './loopReducer.js'

export function derive(state) {
  const cid = state.customerId
  const customer = customers.find((c) => c.id === cid) ?? customers[0]
  const items = state.items[customer.id] ?? []
  const signals = detectSignals(customer, {
    consent: state.consent,
    dismissed: state.dismissed[customer.id] ?? [],
    items,
    telemetry: state.telemetry[customer.id] ?? false,
    campaigns: state.campaigns ?? [],
    campaignDetails: state.campaignDetails ?? {},
  })
  return {
    customer,
    items,
    signals,
    coins: state.coins[customer.id] ?? 0,
    redemptions: state.redemptions?.[customer.id] ?? [],
    // Tolerates older persisted state without dataPreferences; kateTips always mirrors consent
    dataPreferences: { ...defaultDataPreferences(state.consent), ...state.dataPreferences?.[customer.id], kateTips: Boolean(state.consent) },
    activeSignal: signals.find((s) => s.id === state.active.signalId) ?? null,
    activeItem: items.find((i) => i.key === state.active.itemKey) ?? null,
  }
}

// Inbox: notifications derived from the shared state (no extra state besides which ids were read).
// kind: 'repair' | 'upgrade' | 'reward' | 'tip' | 'campaign'; target is a NAVIGATE payload ({ screen, active }).
const REPAIR_TEXT = {
  1: { title: 'Repair requested', body: (name) => `The partner has received your request for your ${name}.` },
  2: { title: 'Technician on the way', body: (name) => `A technician is scheduled for your ${name}.` },
  3: { title: 'Repair completed', body: (name) => `Your ${name} works again. You earned Kate Coins.` },
}
const PARTNER_TEXT = { scheduled: 'Repair visit scheduled', 'on-the-way': 'Technician on the way', 'in-progress': 'Repair in progress', repaired: 'Repair completed' }
const KIND_ORDER = ['repair', 'campaign', 'tip', 'reward', 'upgrade']
const nameOf = (productId) => productById(productId)?.name ?? 'device'

function repairNotifications(items) {
  return items.filter((i) => i.repair && !i.returned).map((i) => {
    const { step, partnerStatus, issue } = i.repair
    const text = REPAIR_TEXT[step] ?? REPAIR_TEXT[1]
    return {
      id: `repair-${i.key}-${partnerStatus ?? step}`,
      kind: 'repair',
      title: PARTNER_TEXT[partnerStatus] ?? text.title,
      body: `${text.body(nameOf(i.productId))} Issue: ${issue}`,
      date: i.repair.updatedOn ?? TODAY,
      target: { screen: 'repair', active: { itemKey: i.key } },
    }
  })
}

/** Items that were repaired before (wear) and have a newer model: suggest a check-up or an upgrade. */
function upgradeNotifications(items, customerType) {
  return items
    .filter((i) => !i.returned && !i.repair && (i.repairs ?? 0) > 0 && upgradeOptions(i.productId, customerType).length > 0)
    .map((i) => ({
      id: `upgrade-${i.key}`,
      kind: 'upgrade',
      title: `Your ${nameOf(i.productId)} has been repaired before`,
      body: 'Plan a free preventive check-up, or upgrade to a newer model and earn Kate Coins for the return.',
      date: TODAY,
      target: { screen: 'item', active: { itemKey: i.key } },
    }))
}

function signalNotifications(signals) {
  return signals.map((s) => ({
    id: `tip-${s.id}`,
    kind: s.campaign ? 'campaign' : 'tip',
    title: s.notification?.title ?? 'A tip from Kate',
    body: s.notification?.body ?? s.headline,
    date: TODAY,
    target: s.itemKey
      ? { screen: 'item', active: { itemKey: s.itemKey } }
      : { screen: 'product', active: { productId: s.productId ?? null, signalId: s.id } },
  }))
}

function rewardNotifications(redemptions) {
  return redemptions.map((r) => {
    const reward = rewardById(r.rewardId)
    return {
      id: `reward-${r.id}`,
      kind: 'reward',
      title: `Reward redeemed: ${reward?.title ?? 'reward'}`,
      body: reward ? `You spent ${reward.cost} Kate Coins.` : 'Thank you for choosing circular.',
      date: r.on ?? TODAY,
      target: { screen: 'rewards', active: {} },
    }
  })
}

/**
 * Notifications for the current customer, newest first (deterministic).
 * @returns {Array<{ id, kind, title, body, date, target: { screen, active }, read: boolean }>}
 */
export function notificationsFor(state) {
  const { customer, items, signals, redemptions } = derive(state)
  const read = state.readNotifications?.[customer.id] ?? []
  return [
    ...repairNotifications(items),
    ...signalNotifications(signals),
    ...rewardNotifications([...redemptions].reverse()),
    ...upgradeNotifications(items, customer.type),
  ]
    .map((n, order) => ({ ...n, read: read.includes(n.id), order }))
    .sort((a, b) => b.date.localeCompare(a.date) || KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) || a.order - b.order)
    .map(({ order, ...n }) => n)
}

/** Number of unread notifications for the current customer (for a badge). */
export const unreadCount = (state) => notificationsFor(state).filter((n) => !n.read).length
