// Fictional personas with fictional accounts and transactions.
// `section` in myKbc ('Rekeningen', 'Kredieten', 'Verzekeringen') and transaction `category` values are keys
// used by the app and the signal rules, so they stay as they are; only the display text is in English.

export const customers = [
  {
    id: 'lotte', name: 'Lotte', fullName: 'Lotte Janssens', type: 'particulier', avatar: 'LJ',
    persona: 'already borrows Philips lights · phone just repaired',
    accountName: 'Current account', iban: 'BE12 3456 7890 1234', balance: 2483.17,
    phoneAgeMonths: 34,
    // Borrowed since last year, so a fault can be reported straight away in the demo.
    borrowed: [{ productId: 'lamp-home', since: '2025-08-01', repairs: 1, room: 'kitchen' }],
    myKbc: [
      { section: 'Rekeningen', name: 'Savings account', sub: 'BE98 7654 3210 9876', value: 6150 },
      { section: 'Verzekeringen', name: 'Home insurance', sub: 'Policy active' },
    ],
    transactions: [
      { id: 't1', date: '2026-10-19', merchant: 'Delhaize Gent', category: 'boodschappen', amount: -42.6 },
      { id: 't2', date: '2026-10-18', merchant: 'GSM Fix Gent', category: 'gsm-herstelling', amount: -179.0 },
      { id: 't3', date: '2026-10-17', merchant: 'NMBS', category: 'mobiliteit', amount: -18.4 },
      { id: 't4', date: '2026-10-15', merchant: 'Employer NV', category: 'loon', amount: 2310.0 },
      { id: 't5', date: '2026-10-05', merchant: 'KBC Loop · Philips', category: 'loop-abonnement', amount: -6.0 },
    ],
  },
  {
    id: 'jonas', name: 'Jonas', fullName: 'Jonas Claes', type: 'particulier', avatar: 'JC',
    persona: 'just bought a house with a KBC home loan',
    accountName: 'Current account', iban: 'BE23 4567 8901 2345', balance: 1840.32,
    homeLoanSince: '2026-10-01',
    borrowed: [],
    myKbc: [
      { section: 'Kredieten', name: 'Home loan', sub: 'Running since 1 Oct 2026', value: -285000 },
      { section: 'Verzekeringen', name: 'Home insurance', sub: 'Policy active since 1 Oct' },
    ],
    transactions: [
      { id: 'j1', date: '2026-10-16', merchant: 'Hubo Gent', category: 'doe-het-zelf', amount: -84.2 },
      { id: 'j2', date: '2026-10-12', merchant: 'Movers removals', category: 'verhuis', amount: -640.0 },
      { id: 'j3', date: '2026-10-09', merchant: 'Notary Vermeulen', category: 'notaris', amount: -9850.0 },
      { id: 'j4', date: '2026-10-01', merchant: 'Employer BV', category: 'loon', amount: 2580.0 },
    ],
  },
  {
    id: 'peeters', name: 'Bakkerij Peeters', fullName: 'Bakkerij Peeters BV', type: 'kmo', avatar: 'BP',
    persona: 'SME · energy bill doubled',
    accountName: 'Business current account', iban: 'BE45 1111 2222 3333', balance: 18420.5,
    avgEnergyBill: 640,
    borrowed: [],
    myKbc: [
      { section: 'Rekeningen', name: 'Business savings account', sub: 'BE67 4444 5555 6666', value: 32000 },
      { section: 'Verzekeringen', name: 'Business insurance', sub: 'Policy active' },
    ],
    transactions: [
      { id: 'k1', date: '2026-10-19', merchant: 'Till receipts', category: 'omzet', amount: 3120.4 },
      { id: 'k2', date: '2026-10-16', merchant: 'Energy supplier', category: 'energie', amount: -1385.0 },
      { id: 'k3', date: '2026-10-14', merchant: 'Molens Van Damme', category: 'grondstoffen', amount: -912.3 },
      { id: 'k5', date: '2026-09-16', merchant: 'Energy supplier', category: 'energie', amount: -702.0 },
      { id: 'k6', date: '2026-08-16', merchant: 'Energy supplier', category: 'energie', amount: -655.0 },
    ],
  },
  {
    // Pitch persona: third washing machine repair this year (€ 85 + € 70 + € 85 = € 240).
    id: 'sarah', name: 'Sarah', fullName: 'Sarah De Smet', type: 'particulier', avatar: 'SD',
    persona: 'third washing machine repair this year',
    accountName: 'Current account', iban: 'BE34 5678 9012 3456', balance: 1967.45,
    borrowed: [],
    myKbc: [
      { section: 'Rekeningen', name: 'Savings account', sub: 'BE76 5432 1098 7654', value: 4200 },
      { section: 'Verzekeringen', name: 'Home insurance', sub: 'Policy active' },
    ],
    // `appliance` = the catalogue product the repair was paid for.
    transactions: [
      { id: 's1', date: '2026-10-19', merchant: 'Colruyt Gent', category: 'boodschappen', amount: -58.3 },
      { id: 's2', date: '2026-10-17', merchant: 'Elektro Service Gent', category: 'herstelling', appliance: 'washer', amount: -85.0 },
      { id: 's3', date: '2026-10-15', merchant: 'Werkgever NV', category: 'loon', amount: 2450.0 },
      { id: 's4', date: '2026-06-03', merchant: 'Elektro Service Gent', category: 'herstelling', appliance: 'washer', amount: -70.0 },
      { id: 's5', date: '2026-02-11', merchant: 'Elektro Service Gent', category: 'herstelling', appliance: 'washer', amount: -85.0 },
    ],
  },
]
