// Signaalregels. Een nieuwe regel toevoegen = één object toevoegen aan deze lijst.
//
// Elke regel heeft:
//   id            unieke sleutel (ook gebruikt om "niet geïnteresseerd" te onthouden)
//   source        'transacties' of 'toestel' (telemetrie); bepaalt of toestemming nodig is
//   applies(ctx)  geldt de regel voor deze klant?
//   match(ctx)    geeft het bewijs terug (transactie of toestel), of null
//   services      bestaande KBC-diensten die het signaal leveren (data/kbcServices.js)
//   build(ctx, m) tekst en actie voor het Kate-inzicht
import { ENERGY_SPIKE_FACTOR } from '../config/index.js'
import { euro, formatDate } from './format.js'

const findTx = (customer, ...categories) => customer.transactions.find((t) => categories.includes(t.category))

export const rules = [
  {
    id: 'phone-repair',
    source: 'transacties',
    services: ['kateInsights', 'psd2'],
    applies: ({ customer, borrowedIds }) => customer.type === 'particulier' && !borrowedIds.includes('phone') && customer.phoneAgeMonths,
    match: ({ customer }) => findTx(customer, 'gsm-herstelling'),
    build: ({ customer }, tx) => ({
      productId: 'phone',
      headline: 'Je gsm kreeg net een herstelling. Leen er een die altijd gratis hersteld wordt?',
      reasons: [
        `Betaling van ${euro(Math.abs(tx.amount), 2)} aan ${tx.merchant} op ${formatDate(tx.date)}.`,
        `Je toestel is ongeveer ${customer.phoneAgeMonths} maanden oud: de kans op nieuwe defecten stijgt.`,
        'Je gaf toestemming om je uitgaven te gebruiken voor persoonlijke voorstellen.',
      ],
    }),
  },
  {
    id: 'energy-spike',
    source: 'transacties',
    services: ['kateInsights', 'businessCo2'],
    applies: ({ customer, borrowedIds }) => customer.type === 'kmo' && !borrowedIds.includes('lamp-shop'),
    match: ({ customer }) => {
      const latest = findTx(customer, 'energie')
      return latest && Math.abs(latest.amount) > ENERGY_SPIKE_FACTOR * customer.avgEnergyBill ? latest : null
    },
    build: ({ customer }, tx) => ({
      productId: 'lamp-shop',
      headline: 'Je energiefactuur is fors gestegen. Leen zuinige verlichting van Philips, zonder investering.',
      reasons: [
        `Laatste energiefactuur: ${euro(Math.abs(tx.amount))}, ruim boven je gemiddelde van ${euro(customer.avgEnergyBill)}.`,
        'Bakkerijen hebben lange openingsuren: verlichting is een groot deel van het verbruik.',
        'Je gaf toestemming om je zakelijke uitgaven te gebruiken voor voorstellen.',
      ],
    }),
  },
  {
    id: 'new-home',
    source: 'transacties',
    services: ['homeLoan', 'kateInsights'],
    applies: ({ customer, borrowedIds }) => Boolean(customer.homeLoanSince) && borrowedIds.length === 0,
    match: ({ customer }) => findTx(customer, 'notaris', 'verhuis'),
    build: ({ customer }, tx) => ({
      productId: 'bundle-home',
      headline: 'Proficiat met je nieuwe huis! Richt het circulair in: verlichting, wasmachine en koelkast in één pakket.',
      reasons: [
        `Je woonkrediet bij KBC startte op ${formatDate(customer.homeLoanSince)}.`,
        `Betaling aan ${tx.merchant} op ${formatDate(tx.date)}.`,
        'Een nieuwe woning betekent veel aankopen tegelijk: lenen spreidt de kost.',
      ],
    }),
  },
  {
    id: 'device-wear',
    source: 'toestel',
    services: ['partnerHub', 'webhooks'],
    applies: ({ telemetry }) => telemetry,
    match: ({ items }) => items.find((i) => i.productId.startsWith('lamp') && !i.returned && !i.repair) ?? null,
    build: (_ctx, item) => ({
      itemKey: item.key,
      headline: `Je Philips-lamp in de ${item.room ?? 'winkel'} meldt slijtage. Philips vervangt ze gratis, nog voor ze uitvalt.`,
      reasons: [
        'De lamp meldt zelf een dalende lichtopbrengst (−18% in 30 dagen).',
        'Zo wordt ze vervangen voor je in het donker zit.',
        'Toesteldata gaat enkel naar Philips voor onderhoud. KBC ziet alleen de status van de herstelling.',
      ],
    }),
  },
]
