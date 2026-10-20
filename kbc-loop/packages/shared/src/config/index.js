// Centrale demo-instellingen. Alle bedragen en factoren zijn indicatief.

export const TODAY = '2026-10-20'
export const TECHNICIAN_SLOT = 'do 22 okt, 9–12 u'

// Gemiddelde uitstoot van een personenwagen, om CO₂ begrijpelijk te maken.
export const CO2_KG_PER_CAR_KM = 0.12

// Beloning in Kate Coins voor circulair gedrag.
export const COINS = { repair: 50, return: 250 }

// Korting wanneer meerdere producten samen geleend worden.
export const BUNDLE_DISCOUNT = 0.1

// Deel van de maandbedragen dat KBC verdient (financiering + verzekering + commissie).
export const KBC_MARGIN_RATE = 0.12

// Een energiefactuur geldt als "fors gestegen" boven dit veelvoud van het gemiddelde.
export const ENERGY_SPIKE_FACTOR = 1.5

// KBC Loop Insights: groepen kleiner dan dit aantal klanten worden niet getoond (anonimiteit).
export const MIN_GROUP_SIZE = 100

// Verwachte omzetting van een Kate-inzicht naar een contract (zie pilotcijfers).
export const EXPECTED_CONVERSION = 0.18

// Herhaalde herstellingen: vanaf dit aantal betalingen voor hetzelfde toestel binnen het venster
// stelt Kate voor om het toestel te lenen (product as a service) in plaats van het zelf te bezitten.
export const REPEAT_REPAIR = { threshold: 3, windowDays: 365 }
