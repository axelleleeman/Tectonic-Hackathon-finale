// Categorieën in KBC Loop. Zonder foto toont de app een illustratie in de kleuren van `tint`
// (foto's toevoegen: zie app/src/ui/photos.js).

export const categories = [
  { id: 'energie', name: 'Elektriciteit & energie', blurb: 'Verlichting, zonnepanelen en batterijen', icon: '⚡', tint: ['#ffd76a', '#ff9f43'], for: ['particulier', 'kmo'] },
  { id: 'toestellen', name: 'Huishoudtoestellen', blurb: 'Wassen, koelen en koffie zetten', icon: '🫧', tint: ['#7fd6ff', '#2e86de'], for: ['particulier'] },
  { id: 'elektronica', name: 'Elektronica', blurb: 'Smartphones, laptops en schermen', icon: '📱', tint: ['#b8a9ff', '#5f27cd'], for: ['particulier', 'kmo'] },
  { id: 'mobiliteit', name: 'Mobiliteit', blurb: 'E-bikes en bakfietsen', icon: '🚲', tint: ['#7bed9f', '#10ac84'], for: ['particulier'] },
  { id: 'gezin', name: 'Gezin & baby', blurb: 'Kinderwagens en autostoelen die meegroeien', icon: '🍼', tint: ['#ffb8d1', '#ee5a8a'], for: ['particulier'] },
  { id: 'zaak', name: 'Voor je zaak', blurb: 'Kantoorinrichting en professionele toestellen', icon: '🏪', tint: ['#a4b0be', '#003665'], for: ['kmo'] },
]
