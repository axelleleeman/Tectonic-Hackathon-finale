// Productcatalogus: alles wordt geleend, de partner blijft eigenaar en herstelt.
// `for` bepaalt welk klanttype het product ziet. Bedragen en CO₂ zijn indicatief.

const p = (o) => ({ expectedRepairs: 0, insuranceMonthly: 0, connected: false, ...o })

export const products = [
  // Elektriciteit & energie
  p({ id: 'lamp-home', partnerId: 'signify', icon: '💡', for: ['particulier'], name: 'Philips LED-pakket woning', detail: '12 slimme LED-lampen + sturing',
    monthly: 6, buyPrice: 420, expectedRepairs: 90, termMonths: 60, co2Kg: 120, connected: true,
    includes: ['Installatie', 'Defecte lamp? Gratis vervangen of hersteld', 'Lampen melden zelf slijtage', 'Upgrade naar zuiniger model', 'Terugname & recyclage'] }),
  p({ id: 'lamp-shop', partnerId: 'signify', icon: '💡', for: ['kmo'], name: 'Philips Light as a Service', detail: 'LED-verlichting winkel & atelier (± 40 armaturen)',
    monthly: 119, buyPrice: 6800, expectedRepairs: 1200, termMonths: 60, co2Kg: 2900, energySavingMonthly: 95, connected: true, payPerUse: true,
    includes: ['Geen investering', 'Onderhoud & herstel door Philips', 'Armaturen melden zelf slijtage', 'Optie: betalen per brandend uur', 'Verzekering via KBC', 'Terugname & recyclage'] }),
  p({ id: 'solar', partnerId: 'solarloop', icon: '☀️', for: ['particulier', 'kmo'], name: 'Zonnepanelen', detail: '8 panelen, ± 3,2 kWp',
    monthly: 39, buyPrice: 5200, expectedRepairs: 400, termMonths: 120, co2Kg: 600, connected: true,
    includes: ['Geen investering', 'Monitoring & herstel', 'Omvormer vervangen inbegrepen', 'Panelen worden gerecycleerd'] }),
  p({ id: 'battery', partnerId: 'voltbox', icon: '🔋', for: ['particulier'], name: 'Thuisbatterij', detail: '5 kWh',
    monthly: 29, buyPrice: 3900, expectedRepairs: 300, termMonths: 120, co2Kg: 300, connected: true,
    includes: ['Installatie', 'Slimme sturing met je zonnepanelen', 'Tweede leven als buurtbatterij'] }),

  // Huishoudtoestellen
  p({ id: 'washer', partnerId: 'washcycle', icon: '🫧', for: ['particulier'], name: 'Wasmachine', detail: 'A-label, 8 kg',
    monthly: 15, buyPrice: 649, expectedRepairs: 220, termMonths: 60, co2Kg: 160,
    includes: ['Levering & installatie', 'Herstelling binnen 48 u', 'Onderdelen worden hergebruikt', 'Terugname'] }),
  p({ id: 'fridge', partnerId: 'coolcircle', icon: '🧊', for: ['particulier'], name: 'Koelkast', detail: 'Combi, A-label',
    monthly: 12, buyPrice: 799, expectedRepairs: 180, termMonths: 60, co2Kg: 200,
    includes: ['Levering & installatie', 'Herstelling binnen 48 u', 'Koelgassen veilig verwerkt'] }),
  p({ id: 'coffee', partnerId: 'brewback', icon: '☕', for: ['particulier'], name: 'Espressomachine', detail: 'Volautomaat',
    monthly: 9, buyPrice: 549, expectedRepairs: 160, termMonths: 48, co2Kg: 60,
    includes: ['Jaarlijks onderhoud', 'Ontkalking inbegrepen', 'Vervangtoestel bij herstelling'] }),

  // Elektronica
  p({ id: 'phone', partnerId: 'refone', icon: '📱', for: ['particulier', 'kmo'], name: 'Smartphone', detail: 'Refurbished topklasse, 128 GB',
    monthly: 29, buyPrice: 899, expectedRepairs: 180, insuranceMonthly: 9, termMonths: 36, co2Kg: 55,
    includes: ['Gratis herstellingen', 'Schadeverzekering via KBC', 'Upgrade na 24 maanden', 'Je oude toestel wordt gerefurbished'] }),
  p({ id: 'laptop', partnerId: 'relapt', icon: '💻', for: ['particulier', 'kmo'], name: 'Laptop', detail: '14", refurbished, 16 GB',
    monthly: 24, buyPrice: 1099, expectedRepairs: 150, termMonths: 36, co2Kg: 250,
    includes: ['Herstelling of vervangtoestel binnen 24 u', 'Batterij vervangen i.p.v. nieuwe laptop', 'Data veilig gewist bij terugname'] }),
  p({ id: 'tv', partnerId: 'pixelloop', icon: '📺', for: ['particulier'], name: 'Tv 55"', detail: '4K, refurbished',
    monthly: 14, buyPrice: 799, expectedRepairs: 120, termMonths: 48, co2Kg: 300,
    includes: ['Levering & ophanging', 'Herstelling aan huis', 'Onderdelen hergebruikt'] }),

  // Mobiliteit
  p({ id: 'ebike', partnerId: 'pedalpool', icon: '🚲', for: ['particulier'], name: 'E-bike', detail: 'Middenmotor, 500 Wh',
    monthly: 45, buyPrice: 2799, expectedRepairs: 450, insuranceMonthly: 8, termMonths: 48, co2Kg: 150,
    includes: ['Onderhoud 2× per jaar', 'Pechhulp', 'Diefstalverzekering via KBC', 'Batterij hergebruikt'] }),
  p({ id: 'cargo', partnerId: 'pedalpool', icon: '🛺', for: ['particulier'], name: 'Elektrische bakfiets', detail: 'Voor 2 kinderen',
    monthly: 69, buyPrice: 4200, expectedRepairs: 600, insuranceMonthly: 10, termMonths: 48, co2Kg: 200,
    includes: ['Onderhoud 2× per jaar', 'Pechhulp', 'Diefstalverzekering via KBC'] }),

  // Gezin & baby
  p({ id: 'stroller', partnerId: 'babycycle', icon: '👶', for: ['particulier'], name: 'Kinderwagen', detail: 'Combi met reiswieg',
    monthly: 15, buyPrice: 899, expectedRepairs: 80, termMonths: 24, co2Kg: 60,
    includes: ['Grondig gereinigd & gecontroleerd', 'Herstel inbegrepen', 'Gaat daarna naar een volgend gezin'] }),
  p({ id: 'carseat', partnerId: 'babycycle', icon: '🧸', for: ['particulier'], name: 'Autostoel', detail: 'Meegroeiend, i-Size',
    monthly: 8, buyPrice: 349, termMonths: 48, co2Kg: 25,
    includes: ['Gratis wissel naar volgende maat', 'Vervanging na ongeval', 'Veiligheidscontrole bij terugname'] }),

  // Voor je zaak
  p({ id: 'desk', partnerId: 'deskloop', icon: '🪑', for: ['kmo'], name: 'Kantoorinrichting', detail: '6 werkplekken',
    monthly: 79, buyPrice: 4500, expectedRepairs: 300, termMonths: 60, co2Kg: 700,
    includes: ['Op- en afbouw', 'Uitbreiden of inkrimpen per maand', 'Meubels worden opgeknapt'] }),
  p({ id: 'coffee-pro', partnerId: 'brewback', icon: '☕', for: ['kmo'], name: 'Professionele koffiemachine', detail: 'Voor winkel of kantoor',
    monthly: 49, buyPrice: 2900, expectedRepairs: 600, termMonths: 60, co2Kg: 180,
    includes: ['Onderhoud & ontkalking', 'Herstelling binnen 24 u', 'Vervangtoestel'] }),
]

// Bundels combineren producten van meerdere partners (prijs wordt berekend in engine/catalog.js).
export const bundles = [
  {
    id: 'bundle-home', icon: '🏠', for: [],
    name: 'Startpakket nieuwe woning', detail: 'Philips-verlichting + wasmachine + koelkast',
    items: ['lamp-home', 'washer', 'fridge'], termMonths: 60,
  },
]
