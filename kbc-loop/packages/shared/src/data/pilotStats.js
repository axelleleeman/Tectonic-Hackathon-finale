// Baseline figures of a fictional pilot scenario for the partner and KBC dashboards.
// Live demo actions are added on top of these.

export const partnerPilot = {
  signify: {
    activeContracts: 1240,
    monthlyRevenue: 48300,
    predictedFailures: 37,
    lifetimeYears: { service: 11.4, sold: 6.1 },
    reusedComponentsPct: 82,
    openRepairs: [
      { customer: 'Café De Hoek', issue: 'Sensor not working', status: 'Technician on the way' },
      { customer: 'Fam. Wouters', issue: 'Light no longer works', status: 'Scheduled · Fri 23 Oct' },
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
    { label: 'Lighting', share: 41 },
    { label: 'Smartphones', share: 27 },
    { label: 'Large appliances', share: 19 },
    { label: 'Laptops', share: 13 },
  ],
}
