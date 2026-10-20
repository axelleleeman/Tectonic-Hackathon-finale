// Circular partners per category. Philips (Signify) is an example partner, not an existing
// collaboration. All other partners are fictional.

export const partners = {
  // Energy & lighting
  signify: { id: 'signify', category: 'energie', name: 'Philips (Signify)', short: 'Philips', tagline: 'Light as a service: Philips keeps ownership, maintains and repairs' },
  solarloop: { id: 'solarloop', category: 'energie', name: 'SolarLoop', short: 'SolarLoop', tagline: 'Solar power without the upfront investment, panels recycled at end of life' },
  voltbox: { id: 'voltbox', category: 'energie', name: 'VoltBox', short: 'VoltBox', tagline: 'Batteries and chargers whose cells get a second life as community storage' },
  heatshift: { id: 'heatshift', category: 'energie', name: 'HeatShift', short: 'HeatShift', tagline: 'Heat pumps installed, serviced and upgraded, with refrigerants recovered' },

  // Appliances
  washcycle: { id: 'washcycle', category: 'toestellen', name: 'WashCycle', short: 'WashCycle', tagline: 'Washing machines and dishwashers on subscription, technician within 48 hours' },
  coolcircle: { id: 'coolcircle', category: 'toestellen', name: 'CoolCircle', short: 'CoolCircle', tagline: 'Fridges and freezers that are refurbished, never landfilled' },
  brewback: { id: 'brewback', category: 'toestellen', name: 'BrewBack', short: 'BrewBack', tagline: 'Coffee machines with servicing and descaling included' },

  // Electronics
  refone: { id: 'refone', category: 'elektronica', name: 'ReFone', short: 'ReFone', tagline: 'Refurbished smartphones and tablets, repaired at your door' },
  relapt: { id: 'relapt', category: 'elektronica', name: 'ReLapt', short: 'ReLapt', tagline: 'Laptops and office IT for home and work, upgraded instead of thrown away' },
  pixelloop: { id: 'pixelloop', category: 'elektronica', name: 'PixelLoop', short: 'PixelLoop', tagline: 'TVs and screens whose parts get a second life' },

  // Mobility
  pedalpool: { id: 'pedalpool', category: 'mobiliteit', name: 'PedalPool', short: 'PedalPool', tagline: 'E-bikes and cargo bikes with servicing and roadside assistance' },
  cargocrew: { id: 'cargocrew', category: 'mobiliteit', name: 'CargoCrew', short: 'CargoCrew', tagline: 'Electric cargo and delivery bikes for businesses, serviced on site' },

  // Family & baby
  babycycle: { id: 'babycycle', category: 'gezin', name: 'BabyCycle', short: 'BabyCycle', tagline: 'Baby gear that passes from family to family' },

  // For your business
  deskloop: { id: 'deskloop', category: 'zaak', name: 'DeskLoop', short: 'DeskLoop', tagline: 'Office furniture that scales with your team' },
  tradecycle: { id: 'tradecycle', category: 'zaak', name: 'TradeCycle', short: 'TradeCycle', tagline: 'Shop fit-out and professional equipment, serviced and refurbished' },
}
