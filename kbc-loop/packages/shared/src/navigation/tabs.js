// The five tabs of KBC Mobile, shared by the app (iOS/Android) and the web KBC LOOP page so both stay identical.
// KBC LOOP lives under the "Loop" tab (∞ symbol). Invest and Business are inactive in the demo and shown light grey.
// `icon` refers to a path set in ../ui/iconPaths.js; `outline` icons get a bolder stroke when active instead of a fill.

export const TABS = [
  { id: 'home', label: 'Home', icon: 'wallet' },
  { id: 'mykbc', label: 'My KBC', icon: 'list' },
  { id: 'invest', label: 'Invest', icon: 'piggy', disabled: true },
  { id: 'business', label: 'Business', icon: 'briefcase', disabled: true },
  { id: 'loop', label: 'Loop', icon: 'loop', outline: true },
]

export const tabById = (id) => TABS.find((t) => t.id === id) ?? null
