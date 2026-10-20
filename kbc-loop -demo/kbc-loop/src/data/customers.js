// Fictieve persona's met fictieve rekeningen en verrichtingen.

export const customers = [
  {
    id: 'lotte', name: 'Lotte', fullName: 'Lotte Janssens', type: 'particulier', avatar: 'LJ',
    persona: 'leent al Philips-lampen · gsm net hersteld',
    accountName: 'Zichtrekening', iban: 'BE12 3456 7890 1234', balance: 2483.17,
    phoneAgeMonths: 34,
    // Al geleend sinds vorig jaar: zo kan je in de demo meteen een defect melden.
    borrowed: [{ productId: 'lamp-home', since: '2025-08-01', repairs: 1, room: 'keuken' }],
    myKbc: [
      { section: 'Rekeningen', name: 'Spaarrekening', sub: 'BE98 7654 3210 9876', value: 6150 },
      { section: 'Verzekeringen', name: 'Woonverzekering', sub: 'Polis actief' },
    ],
    transactions: [
      { id: 't1', date: '2026-10-19', merchant: 'Delhaize Gent', category: 'boodschappen', amount: -42.6 },
      { id: 't2', date: '2026-10-18', merchant: 'GSM Fix Gent', category: 'gsm-herstelling', amount: -179.0 },
      { id: 't3', date: '2026-10-17', merchant: 'NMBS', category: 'mobiliteit', amount: -18.4 },
      { id: 't4', date: '2026-10-15', merchant: 'Werkgever NV', category: 'loon', amount: 2310.0 },
      { id: 't5', date: '2026-10-05', merchant: 'KBC Loop · Philips', category: 'loop-abonnement', amount: -6.0 },
    ],
  },
  {
    id: 'jonas', name: 'Jonas', fullName: 'Jonas Claes', type: 'particulier', avatar: 'JC',
    persona: 'kocht net een huis met een KBC-woonkrediet',
    accountName: 'Zichtrekening', iban: 'BE23 4567 8901 2345', balance: 1840.32,
    homeLoanSince: '2026-10-01',
    borrowed: [],
    myKbc: [
      { section: 'Kredieten', name: 'Woonkrediet', sub: 'Lopend sinds 1 okt 2026', value: -285000 },
      { section: 'Verzekeringen', name: 'Woonverzekering', sub: 'Polis actief sinds 1 okt' },
    ],
    transactions: [
      { id: 'j1', date: '2026-10-16', merchant: 'Hubo Gent', category: 'doe-het-zelf', amount: -84.2 },
      { id: 'j2', date: '2026-10-12', merchant: 'Verhuisfirma Movers', category: 'verhuis', amount: -640.0 },
      { id: 'j3', date: '2026-10-09', merchant: 'Notariskantoor Vermeulen', category: 'notaris', amount: -9850.0 },
      { id: 'j4', date: '2026-10-01', merchant: 'Werkgever BV', category: 'loon', amount: 2580.0 },
    ],
  },
  {
    id: 'peeters', name: 'Bakkerij Peeters', fullName: 'Bakkerij Peeters BV', type: 'kmo', avatar: 'BP',
    persona: 'kmo · energiefactuur verdubbeld',
    accountName: 'Zakelijke zichtrekening', iban: 'BE45 1111 2222 3333', balance: 18420.5,
    avgEnergyBill: 640,
    borrowed: [],
    myKbc: [
      { section: 'Rekeningen', name: 'Zakelijke spaarrekening', sub: 'BE67 4444 5555 6666', value: 32000 },
      { section: 'Verzekeringen', name: 'Bedrijfsverzekering', sub: 'Polis actief' },
    ],
    transactions: [
      { id: 'k1', date: '2026-10-19', merchant: 'Kassa-ontvangsten', category: 'omzet', amount: 3120.4 },
      { id: 'k2', date: '2026-10-16', merchant: 'Energieleverancier', category: 'energie', amount: -1385.0 },
      { id: 'k3', date: '2026-10-14', merchant: 'Molens Van Damme', category: 'grondstoffen', amount: -912.3 },
      { id: 'k5', date: '2026-09-16', merchant: 'Energieleverancier', category: 'energie', amount: -702.0 },
      { id: 'k6', date: '2026-08-16', merchant: 'Energieleverancier', category: 'energie', amount: -655.0 },
    ],
  },
]
