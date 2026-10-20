// Geaggregeerde, geanonimiseerde uitgavenpatronen voor KBC Loop Insights (interne KBC-weergave).
// Fictieve cijfers. Elke groep telt klanten met hetzelfde patroon in hun betalingen, nooit individuen.
//
//   kind         'herstelling' (betalingen aan herstellers) of 'herhaalaankoop' (zelfde product opnieuw gekocht)
//   customers    aantal klanten in de groep (groepen onder MIN_GROUP_SIZE worden niet getoond)
//   costYearly   gemiddelde kost per klant per jaar nu: aankoop (afgeschreven) + herstellingen
//   consentPct   deel van de groep dat toestemming gaf voor persoonlijke voorstellen
//   trendPct     verandering van het aantal betalingen t.o.v. vorig jaar
//   productId    huurproduct in KBC Loop dat past bij dit patroon

export const spendSegments = [
  { id: 'seg-phone-repair', kind: 'herstelling', customerType: 'particulier', label: 'Smartphone laten herstellen', merchants: 'gsm-herstellers, schermherstel', pattern: '≥ 1 herstelling in 12 maanden, toestel ouder dan 2 jaar', customers: 18_400, costYearly: 430, consentPct: 61, trendPct: 12, productId: 'phone' },
  { id: 'seg-bike-repair', kind: 'herstelling', customerType: 'particulier', label: 'E-bike naar de fietsenmaker', merchants: 'fietsenmakers, fietsherstel', pattern: '≥ 2 herstellingen in 12 maanden', customers: 12_900, costYearly: 690, consentPct: 60, trendPct: 15, productId: 'ebike' },
  { id: 'seg-washer-repair', kind: 'herstelling', customerType: 'particulier', label: 'Wasmachine laten herstellen', merchants: 'witgoedherstellers, technici aan huis', pattern: '≥ 1 herstelling in 12 maanden', customers: 9_600, costYearly: 240, consentPct: 58, trendPct: 8, productId: 'washer' },
  { id: 'seg-baby', kind: 'herhaalaankoop', customerType: 'particulier', label: 'Babyspullen kopen', merchants: 'babywinkels, kinderwagens', pattern: 'grote aankoop babyuitrusting in 6 maanden', customers: 5_800, costYearly: 480, consentPct: 66, trendPct: 1, productId: 'stroller' },
  { id: 'seg-coffee-rebuy', kind: 'herhaalaankoop', customerType: 'particulier', label: 'Koffiemachine opnieuw kopen', merchants: 'elektrozaken, webshops', pattern: '≥ 2 koffiemachines in 4 jaar', customers: 4_300, costYearly: 290, consentPct: 63, trendPct: 5, productId: 'coffee' },
  { id: 'seg-laptop-rebuy', kind: 'herhaalaankoop', customerType: 'particulier', label: 'Laptop vervangen', merchants: 'elektrozaken, computerherstellers', pattern: '≥ 2 laptops in 4 jaar of herstelling > € 150', customers: 3_100, costYearly: 410, consentPct: 55, trendPct: 3, productId: 'laptop' },
  { id: 'seg-tv-repair', kind: 'herstelling', customerType: 'particulier', label: 'Tv laten herstellen', merchants: 'tv- en audioherstellers', pattern: '≥ 1 herstelling in 24 maanden', customers: 1_150, costYearly: 240, consentPct: 57, trendPct: -2, productId: 'tv' },
  { id: 'seg-cargo-repair', kind: 'herstelling', customerType: 'particulier', label: 'Bakfiets laten herstellen', merchants: 'bakfietsherstellers', pattern: '≥ 2 herstellingen in 12 maanden', customers: 64, costYearly: 820, consentPct: 59, trendPct: 20, productId: 'cargo' },
  { id: 'seg-kmo-light', kind: 'herstelling', customerType: 'kmo', label: 'Verlichting vervangen + hoge energiefactuur', merchants: 'elektriciens, energieleveranciers', pattern: 'energiefactuur > 1,5× gemiddelde en elektricienkosten', customers: 2_350, costYearly: 2_100, consentPct: 70, trendPct: 22, productId: 'lamp-shop' },
  { id: 'seg-kmo-coffee', kind: 'herstelling', customerType: 'kmo', label: 'Professionele koffiemachine herstellen', merchants: 'horecatechnici', pattern: '≥ 2 herstellingen in 12 maanden', customers: 640, costYearly: 820, consentPct: 72, trendPct: 6, productId: 'coffee-pro' },
]
