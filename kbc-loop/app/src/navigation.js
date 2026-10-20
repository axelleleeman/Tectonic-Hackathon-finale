// Per scherm: soort kopbalk, titel, terug-bestemming en actief tabblad (zoals in KBC Mobile).
export const SCREENS = {
  home: { bar: 'search', placeholder: 'Hoe kan ik je helpen?', tab: 'home' },
  mykbc: { bar: 'title', title: 'Mijn KBC', tab: 'mykbc' },
  shop: { bar: 'title', title: 'Aanbod', tab: 'shop' },
  category: { bar: 'back', title: 'KBC Loop', tab: 'shop', back: () => 'shop' },
  product: { bar: 'back', title: 'KBC Loop', tab: 'shop', back: (a) => (a.categoryId ? 'category' : a.signalId ? 'home' : 'shop') },
  done: { bar: 'back', title: 'KBC Loop', tab: 'mykbc', back: () => 'mykbc' },
  repair: { bar: 'back', title: 'Herstelling', tab: 'mykbc', back: () => 'mykbc' },
}

// De vijf tabbladen van KBC Mobile. KBC Loop zit onder "Aanbod"; Beleggen en Zakelijk doen niets in de demo.
export const TABS = [
  { id: 'home', label: 'Start', icon: 'wallet' },
  { id: 'mykbc', label: 'Mijn KBC', icon: 'list' },
  { id: 'invest', label: 'Beleggen', icon: 'piggy', disabled: true },
  { id: 'business', label: 'Zakelijk', icon: 'briefcase', disabled: true },
  { id: 'shop', label: 'Aanbod', icon: 'layers' },
]
