// Categories in KBC Loop. Without a photo the app shows an illustration in the `tint` colours
// (adding photos: see app/src/ui/photos.js).
// Ids are kept in Dutch for now: the persisted demo database and other code reference them.

export const categories = [
  { id: 'energie', name: 'Energy & lighting', blurb: 'Lighting, solar panels, batteries, EV charging and heat pumps', icon: '⚡', tint: ['#ffd76a', '#ff9f43'], for: ['particulier', 'kmo'] },
  { id: 'toestellen', name: 'Appliances', blurb: 'Washing, cooling and coffee, at home or in the shop', icon: '🫧', tint: ['#7fd6ff', '#2e86de'], for: ['particulier', 'kmo'] },
  { id: 'elektronica', name: 'Electronics', blurb: 'Smartphones, tablets, laptops and screens', icon: '📱', tint: ['#b8a9ff', '#5f27cd'], for: ['particulier', 'kmo'] },
  { id: 'mobiliteit', name: 'Mobility', blurb: 'E-bikes, cargo bikes and delivery bikes', icon: '🚲', tint: ['#7bed9f', '#10ac84'], for: ['particulier', 'kmo'] },
  { id: 'gezin', name: 'Family & baby', blurb: 'Strollers, car seats and nursery gear that grows with your child', icon: '🍼', tint: ['#ffb8d1', '#ee5a8a'], for: ['particulier'] },
  { id: 'zaak', name: 'For your business', blurb: 'Office furniture, shop fit-out and professional equipment', icon: '🏪', tint: ['#a4b0be', '#003665'], for: ['kmo'] },
]
