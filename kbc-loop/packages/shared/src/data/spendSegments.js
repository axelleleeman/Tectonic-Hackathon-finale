// Aggregated, anonymised spending patterns for KBC Loop Insights (internal KBC view).
// Fictional figures. Each group counts customers with the same pattern in their payments, never individuals.
//
//   kind         'herstelling' (payments to repairers) or 'herhaalaankoop' (same product bought again); kept as keys
//   customers    number of customers in the group (groups below MIN_GROUP_SIZE are not shown)
//   costYearly   current average cost per customer per year: purchase (depreciated) + repairs
//   consentPct   share of the group that consented to personal offers
//   trendPct     change in the number of payments compared with last year
//   productId    KBC Loop rental product that fits this pattern

export const spendSegments = [
  { id: 'seg-phone-repair', kind: 'herstelling', customerType: 'particulier', label: 'Smartphone repairs', merchants: 'phone repair shops, screen repair', pattern: '≥ 1 repair in 12 months, device older than 2 years', customers: 18_400, costYearly: 430, consentPct: 61, trendPct: 12, productId: 'phone' },
  { id: 'seg-bike-repair', kind: 'herstelling', customerType: 'particulier', label: 'E-bike repairs at the bike shop', merchants: 'bike shops, bike repair', pattern: '≥ 2 repairs in 12 months', customers: 12_900, costYearly: 690, consentPct: 60, trendPct: 15, productId: 'ebike' },
  { id: 'seg-washer-repair', kind: 'herstelling', customerType: 'particulier', label: 'Washing machine repairs', merchants: 'appliance repairers, home technicians', pattern: '≥ 1 repair in 12 months', customers: 9_600, costYearly: 240, consentPct: 58, trendPct: 8, productId: 'washer' },
  { id: 'seg-baby', kind: 'herhaalaankoop', customerType: 'particulier', label: 'Buying baby gear', merchants: 'baby shops, stroller retailers', pattern: 'large baby-equipment purchase within 6 months', customers: 5_800, costYearly: 480, consentPct: 66, trendPct: 1, productId: 'stroller' },
  { id: 'seg-coffee-rebuy', kind: 'herhaalaankoop', customerType: 'particulier', label: 'Buying a new coffee machine again', merchants: 'electronics stores, web shops', pattern: '≥ 2 coffee machines in 4 years', customers: 4_300, costYearly: 290, consentPct: 63, trendPct: 5, productId: 'coffee' },
  { id: 'seg-laptop-rebuy', kind: 'herhaalaankoop', customerType: 'particulier', label: 'Replacing a laptop', merchants: 'electronics stores, computer repairers', pattern: '≥ 2 laptops in 4 years or a repair > € 150', customers: 3_100, costYearly: 410, consentPct: 55, trendPct: 3, productId: 'laptop' },
  { id: 'seg-tv-repair', kind: 'herstelling', customerType: 'particulier', label: 'TV repairs', merchants: 'TV and audio repairers', pattern: '≥ 1 repair in 24 months', customers: 1_150, costYearly: 240, consentPct: 57, trendPct: -2, productId: 'tv' },
  { id: 'seg-cargo-repair', kind: 'herstelling', customerType: 'particulier', label: 'Cargo bike repairs', merchants: 'cargo bike repairers', pattern: '≥ 2 repairs in 12 months', customers: 64, costYearly: 820, consentPct: 59, trendPct: 20, productId: 'cargo' },
  { id: 'seg-kmo-light', kind: 'herstelling', customerType: 'kmo', label: 'Replacing lighting + high energy bill', merchants: 'electricians, energy suppliers', pattern: 'energy bill > 1.5× average and electrician costs', customers: 2_350, costYearly: 2_100, consentPct: 70, trendPct: 22, productId: 'lamp-shop' },
  { id: 'seg-kmo-coffee', kind: 'herstelling', customerType: 'kmo', label: 'Professional coffee machine repairs', merchants: 'catering equipment technicians', pattern: '≥ 2 repairs in 12 months', customers: 640, costYearly: 820, consentPct: 72, trendPct: 6, productId: 'coffee-pro' },
]
