// Basiscijfers van een fictief pilotscenario voor de partner- en KBC-dashboards.
// De live demo-acties worden hier bovenop geteld.

export const partnerPilot = {
  signify: {
    activeContracts: 1240,
    monthlyRevenue: 48300,
    predictedFailures: 37,
    lifetimeYears: { service: 11.4, sold: 6.1 },
    reusedComponentsPct: 82,
    openRepairs: [
      { customer: 'Café De Hoek', issue: 'Sensor werkt niet', status: 'Technieker onderweg' },
      { customer: 'Fam. Wouters', issue: 'Lamp brandt niet meer', status: 'Ingepland · vr 23 okt' },
    ],
  },
}

export const kbcPilot = {
  customers: 2870,
  financedVolume: 3_200_000,
  monthlyFees: 178_000,
  co2Tons: 412,
  partners: 4,
  conversionPct: 18,
  insuredPct: 64,
  byCategory: [
    { label: 'Verlichting', share: 41 },
    { label: 'Smartphones', share: 27 },
    { label: 'Witgoed', share: 19 },
    { label: 'Laptops', share: 13 },
  ],
}
