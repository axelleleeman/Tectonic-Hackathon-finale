// Partner profiles for the catalogue and partner pages. All figures are illustrative demo values.
// Every partner is fictional, except Philips (Signify), which is an example partner and not an existing
// collaboration: its profile only contains generic statements and illustrative figures, no real company facts.
// Certifications are generic labels, always marked '(demo)'.

const DEFAULT_PROFILE = {
  about: 'A circular partner of KBC Loop. The partner stays the owner of the product, repairs it and takes it back at the end of the term.',
  founded: null,
  headquarters: 'Belgium',
  serviceArea: 'All of Belgium',
  repairSlaHours: 72,
  technicians: 0,
  refurbishRate: 0,
  co2PerUnitKg: 0,
  certifications: [],
  services: ['Delivery and installation', 'Repairs included', 'Take-back at the end of the term'],
  highlight: 'Borrow instead of buy, with repairs and take-back included',
}

export const partnerProfiles = {
  signify: {
    about: 'Philips (Signify) is shown here as an example partner, not an existing collaboration. In this demo it offers light as a service: the partner keeps ownership of the fixtures, maintains and repairs them, and takes them back for reuse or recycling.',
    founded: null,
    headquarters: 'Brussels (demo office)',
    serviceArea: 'All of Belgium',
    repairSlaHours: 48,
    technicians: 40,
    refurbishRate: 70,
    co2PerUnitKg: 900,
    certifications: ['ISO 14001 (demo)', 'Circular design label (demo)'],
    services: ['Lighting plan and installation', 'Connected fixtures that report wear', 'Maintenance and repair', 'Pay per lit hour (business)', 'Take-back and recycling'],
    highlight: 'Example partner: light as a service, maintained for you',
  },
  solarloop: {
    about: 'SolarLoop installs solar panels without an upfront investment. It monitors yield remotely, replaces inverters when needed and recycles panels at the end of their life.',
    founded: 2016, headquarters: 'Ghent', serviceArea: 'All of Belgium',
    repairSlaHours: 72, technicians: 55, refurbishRate: 62, co2PerUnitKg: 640,
    certifications: ['B Corp (demo)', 'ISO 14001 (demo)', 'Certified PV installer (demo)'],
    services: ['Roof survey and installation', 'Remote yield monitoring', 'Inverter replacement included', 'Panel recycling'],
    highlight: '98% of panel materials recovered at end of life',
  },
  voltbox: {
    about: 'VoltBox supplies home batteries and EV chargers. When cells lose capacity, they get a second life as community storage before being recycled.',
    founded: 2019, headquarters: 'Leuven', serviceArea: 'Flanders and Brussels',
    repairSlaHours: 48, technicians: 28, refurbishRate: 74, co2PerUnitKg: 310,
    certifications: ['ISO 14001 (demo)', 'Battery passport ready (demo)'],
    services: ['Battery and charger installation', 'Smart charging in the app', 'Cell health monitoring', 'Second-life community storage'],
    highlight: 'Retired cells power neighbourhood storage',
  },
  heatshift: {
    about: 'HeatShift installs and services heat pumps. Units are upgraded instead of replaced, and refrigerants are recovered during every intervention.',
    founded: 2014, headquarters: 'Antwerp', serviceArea: 'All of Belgium',
    repairSlaHours: 24, technicians: 64, refurbishRate: 58, co2PerUnitKg: 1400,
    certifications: ['ISO 14001 (demo)', 'F-gas certified (demo)', 'B Corp (demo)'],
    services: ['Heat study and installation', 'Annual service', 'Refrigerant recovery', 'Upgrade to newer models'],
    highlight: 'Technician on site within 24 hours in winter',
  },
  washcycle: {
    about: 'WashCycle offers washing machines and dishwashers on subscription. Machines are built to be repaired, refurbished at the end of the term and placed with a new household.',
    founded: 2015, headquarters: 'Mechelen', serviceArea: 'All of Belgium',
    repairSlaHours: 48, technicians: 72, refurbishRate: 81, co2PerUnitKg: 220,
    certifications: ['B Corp (demo)', 'Repairability score A (demo)'],
    services: ['Delivery and connection', 'Technician within 48 hours', 'Refurbishment at end of term', 'Old appliance taken away'],
    highlight: '8 in 10 machines get a second household',
  },
  coolcircle: {
    about: 'CoolCircle rents out fridges and freezers. Every returned unit is refurbished or stripped for parts, so none end up in landfill.',
    founded: 2017, headquarters: 'Kortrijk', serviceArea: 'Flanders and Brussels',
    repairSlaHours: 24, technicians: 34, refurbishRate: 77, co2PerUnitKg: 260,
    certifications: ['ISO 14001 (demo)', 'Zero landfill (demo)'],
    services: ['Delivery and installation', 'Food-loss cover after a breakdown', 'Refurbishment', 'Refrigerant recovery'],
    highlight: 'Zero units to landfill since the start',
  },
  brewback: {
    about: 'BrewBack places coffee machines at home and in the office, with descaling and servicing included. Machines are rebuilt and reused after each term.',
    founded: 2020, headquarters: 'Hasselt', serviceArea: 'Flanders and Brussels',
    repairSlaHours: 48, technicians: 18, refurbishRate: 85, co2PerUnitKg: 90,
    certifications: ['Fair trade sourcing (demo)', 'B Corp (demo)'],
    services: ['Delivery and set-up', 'Descaling and servicing', 'Swap machine while repaired', 'Rebuild and reuse'],
    highlight: 'A replacement machine while yours is serviced',
  },
  refone: {
    about: 'ReFone offers refurbished smartphones and tablets. Repairs happen at your door, and every device is refurbished again when it comes back.',
    founded: 2013, headquarters: 'Brussels', serviceArea: 'All of Belgium',
    repairSlaHours: 24, technicians: 46, refurbishRate: 88, co2PerUnitKg: 55,
    certifications: ['ISO 14001 (demo)', 'Data wipe certified (demo)'],
    services: ['Repair at your door', 'Certified data wipe', 'Screen and battery cover', 'Refurbishment'],
    highlight: 'Screen repaired at your door, usually the same day',
  },
  relapt: {
    about: 'ReLapt supplies laptops and office IT for home and work. Devices are upgraded with new parts instead of being thrown away.',
    founded: 2016, headquarters: 'Leuven', serviceArea: 'All of Belgium',
    repairSlaHours: 48, technicians: 38, refurbishRate: 83, co2PerUnitKg: 190,
    certifications: ['ISO 27001 (demo)', 'ISO 14001 (demo)'],
    services: ['Set-up and data transfer', 'Upgrade instead of replace', 'Next-business-day repair', 'Certified data wipe'],
    highlight: 'Upgraded, not replaced: memory and batteries swapped in',
  },
  pixelloop: {
    about: 'PixelLoop rents out TVs and screens. Panels, boards and housings get a second life as spare parts when a screen is retired.',
    founded: 2018, headquarters: 'Liège', serviceArea: 'Wallonia and Brussels',
    repairSlaHours: 72, technicians: 22, refurbishRate: 66, co2PerUnitKg: 150,
    certifications: ['WEEE compliant (demo)', 'ISO 14001 (demo)'],
    services: ['Delivery and wall mounting', 'Repair or swap', 'Parts harvesting', 'Take-back'],
    highlight: 'Retired screens become spare parts for others',
  },
  pedalpool: {
    about: 'PedalPool rents out e-bikes and cargo bikes with servicing and roadside assistance. Frames and batteries are refurbished between riders.',
    founded: 2017, headquarters: 'Ghent', serviceArea: 'Flanders and Brussels',
    repairSlaHours: 24, technicians: 52, refurbishRate: 79, co2PerUnitKg: 480,
    certifications: ['B Corp (demo)', 'Certified bike mechanic (demo)'],
    services: ['Annual service', 'Roadside assistance', 'Theft insurance via KBC', 'Battery refurbishment'],
    highlight: 'Roadside assistance included, every ride',
  },
  cargocrew: {
    about: 'CargoCrew supplies electric cargo and delivery bikes to businesses and services them on site, so fleets keep moving.',
    founded: 2019, headquarters: 'Antwerp', serviceArea: 'Flanders and Brussels',
    repairSlaHours: 24, technicians: 24, refurbishRate: 72, co2PerUnitKg: 900,
    certifications: ['ISO 14001 (demo)', 'Fleet safety label (demo)'],
    services: ['On-site servicing', 'Replacement bike during repair', 'Fleet dashboard', 'Rider training'],
    highlight: 'A replacement bike the same day',
  },
  babycycle: {
    about: 'BabyCycle lends out prams, car seats and cots that pass from family to family. Every item is checked, cleaned and safety-tested between uses.',
    founded: 2018, headquarters: 'Bruges', serviceArea: 'All of Belgium',
    repairSlaHours: 72, technicians: 12, refurbishRate: 91, co2PerUnitKg: 70,
    certifications: ['Safety tested (demo)', 'B Corp (demo)'],
    services: ['Delivery and pick-up', 'Hygiene check between families', 'Swap to the next size', 'Safety testing'],
    highlight: 'Swap to the next size as your child grows',
  },
  deskloop: {
    about: 'DeskLoop furnishes offices with refurbished desks, chairs and storage that scale with your team, and takes furniture back when you no longer need it.',
    founded: 2015, headquarters: 'Brussels', serviceArea: 'All of Belgium',
    repairSlaHours: 72, technicians: 20, refurbishRate: 86, co2PerUnitKg: 120,
    certifications: ['FSC sourced (demo)', 'ISO 14001 (demo)'],
    services: ['Office plan and installation', 'Scale up or down', 'Repair and reupholstery', 'Take-back'],
    highlight: 'Scale up or down as your team changes',
  },
  tradecycle: {
    about: 'TradeCycle fits out shops and workplaces with professional equipment that is serviced on site and refurbished at the end of the term.',
    founded: 2012, headquarters: 'Namur', serviceArea: 'All of Belgium',
    repairSlaHours: 48, technicians: 30, refurbishRate: 69, co2PerUnitKg: 650,
    certifications: ['ISO 9001 (demo)', 'ISO 14001 (demo)'],
    services: ['Fit-out design and installation', 'Preventive maintenance', 'Repair on site', 'Refurbishment'],
    highlight: 'Preventive maintenance keeps your shop open',
  },
}

/** Returns the profile of a partner, or a sensible default for an unknown id. */
export function partnerProfile(id) {
  return partnerProfiles[id] ?? DEFAULT_PROFILE
}
