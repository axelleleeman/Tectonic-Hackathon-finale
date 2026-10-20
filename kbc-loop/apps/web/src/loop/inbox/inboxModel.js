// Inbox model for the web: the shared notifications with a read flag, unread first (newest first within each group),
// and the KBC LOOP route a notification target (an app screen + active ids) maps to.
import { notificationsFor } from '@kbc-loop/shared/state/derive.js'

export function inboxList(state) {
  if (!state) return []
  const read = new Set(state.readNotifications?.[state.customerId] ?? [])
  return notificationsFor(state)
    .map((n) => ({ ...n, read: n.read ?? read.has(n.id) }))
    .sort((a, b) => (a.read - b.read) || String(b.date ?? '').localeCompare(String(a.date ?? '')))
}

/** App screen target → [route, param] on the web page. */
export function webTarget(target) {
  const { screen, active = {} } = target ?? {}
  if ((screen === 'item' || screen === 'repair') && active.itemKey) return ['product', active.itemKey]
  if (screen === 'costs') return ['costs']
  if (screen === 'rewards') return ['rewards']
  if (screen === 'category' || screen === 'product') return ['catalog', active.categoryId ?? null]
  return ['home']
}
