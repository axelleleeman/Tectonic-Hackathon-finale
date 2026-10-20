// Per screen: header type, title, back destination and active tab (as in KBC Mobile).
// The tabs themselves come from the shared single source of truth, so app and web always match.
import { TABS } from '@kbc-loop/shared/navigation/tabs.js'

export { TABS }

export const SCREENS = {
  home: { bar: 'search', placeholder: 'How can I help you?', tab: 'home' },
  mykbc: { bar: 'title', title: 'My KBC', tab: 'mykbc' },
  shop: { bar: 'title', title: 'Loop', tab: 'loop' },
  category: { bar: 'back', title: 'KBC Loop', tab: 'loop', back: () => 'shop' },
  product: { bar: 'back', title: 'KBC Loop', tab: 'loop', back: (a) => (a.categoryId ? 'category' : a.signalId ? 'home' : 'shop') },
  done: { bar: 'back', title: 'KBC Loop', tab: 'mykbc', back: () => 'mykbc' },
  repair: { bar: 'back', title: 'Repair', tab: 'mykbc', back: () => 'mykbc' },
}

// Tab id → app screen. The Loop tab opens the KBC Loop offers screen ('shop' in the shared reducer).
const TAB_SCREENS = { loop: 'shop' }
export const screenForTab = (tabId) => TAB_SCREENS[tabId] ?? tabId
