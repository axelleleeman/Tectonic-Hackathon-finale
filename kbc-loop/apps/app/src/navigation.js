// Per screen: header type, title, back destination and active tab (as in KBC Mobile).
// back(active, previousScreen) returns the screen to go back to, or [screen, active] to also set the active ids.
// The tabs themselves come from the shared single source of truth, so app and web always match.
import { TABS as SHARED_TABS } from '@kbc-loop/shared/navigation/tabs.js'

// In the app everything happens inside Loop: the other KBC Mobile tabs are shown dimmed and disabled.
export const TABS = SHARED_TABS.map((t) => (t.id === 'loop' ? t : { ...t, disabled: true }))

// Loop is the start screen; the old Home and My KBC screens show Loop instead (see LoopApp).
const LOOP = { bar: 'title', title: 'Loop', tab: 'loop' }

export const SCREENS = {
  home: LOOP,
  mykbc: LOOP,
  shop: LOOP,
  // Without a category: the service catalogue; with one: its partners. Back goes category → catalogue → Loop.
  category: { bar: 'back', title: 'Add a product', tab: 'loop', back: (a) => (a.categoryId ? ['category', { categoryId: null }] : 'shop') },
  product: { bar: 'back', title: 'KBC Loop', tab: 'loop', back: (a) => (a.categoryId ? 'category' : 'shop') },
  done: { bar: 'back', title: 'KBC Loop', tab: 'loop', back: () => 'shop' },
  repair: { bar: 'back', title: 'Repair', tab: 'loop', back: (a) => (a.itemKey ? 'item' : 'shop') },
  // Product detail of a borrowed item and the cost overview: back to where the customer came from.
  item: { bar: 'back', title: 'My product', tab: 'loop', back: (_, prev) => (BACK_TARGETS.includes(prev) ? prev : 'shop') },
  rewards: { bar: 'back', title: 'Rewards', tab: 'loop', back: () => 'shop' },
  inbox: { bar: 'back', title: 'Notifications', tab: 'loop', back: () => 'shop' },
  consent: { bar: 'back', title: 'Your data', tab: 'loop', back: () => 'shop' },
  costs: { bar: 'back', title: 'Costs', tab: 'loop', back: (_, prev) => (BACK_TARGETS.includes(prev) && prev !== 'item' ? prev : 'shop') },
}

// Screens that item/costs may return to (`prev` is the screen shown before, tracked in LoopApp).
const BACK_TARGETS = ['shop', 'costs']

// Tab id → app screen. The Loop tab opens the KBC Loop offers screen ('shop' in the shared reducer).
const TAB_SCREENS = { loop: 'shop' }
export const screenForTab = (tabId) => TAB_SCREENS[tabId] ?? tabId
