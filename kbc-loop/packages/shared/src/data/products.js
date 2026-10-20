// Product catalogue: everything is borrowed, the partner stays the owner and repairs.
// `for` decides which customer type sees the product ('particulier' = personal, 'kmo' = business).
// Amounts and CO₂ are indicative. Rule of thumb: monthly × termMonths stays close to
// buyPrice + expectedRepairs (+ insuranceMonthly × termMonths), so the cost comparison is fair.
//
// Fields used by the engine:
//   monthly, termMonths                         rent (engine/pricing.js)
//   buyPrice, expectedRepairs, insuranceMonthly cost of buying over the same term (engine/pricing.js)
//   co2Kg                                       CO₂ avoided over the term vs. buying new (engine/impact.js)
//   energySavingMonthly                         optional, lower energy bill per month (cost comparison)
//   connected                                   the device reports wear itself (telemetry)
//   payPerUse                                   option to pay per use via machine-to-machine payments
// Product ids are kept as they are: the persisted demo database references them.

const p = (o) => ({ expectedRepairs: 0, insuranceMonthly: 0, connected: false, ...o })

export const products = [
  // ── Energy & lighting ───────────────────────────────────────────────────────────────────────
  // Philips (Signify)
  p({ id: 'lamp-home', partnerId: 'signify', icon: '💡', for: ['particulier'], name: 'Philips LED home package', detail: '12 smart LED bulbs with app and voice control',
    monthly: 6, buyPrice: 420, expectedRepairs: 90, termMonths: 60, co2Kg: 120, connected: true,
    includes: ['Installation', 'Faulty bulb replaced or repaired free of charge', 'Bulbs report wear themselves', 'Upgrade to a more efficient model', 'Take-back and recycling'] }),
  p({ id: 'lamp-outdoor', partnerId: 'signify', icon: '🏡', for: ['particulier'], name: 'Philips outdoor lighting', detail: 'Garden, path and façade lights with motion sensors',
    monthly: 5, buyPrice: 380, expectedRepairs: 60, termMonths: 60, co2Kg: 70, connected: true,
    includes: ['Installation by a certified electrician', 'Weatherproof fittings, repaired free of charge', 'Lights report wear themselves', 'Take-back and recycling'] }),
  p({ id: 'lamp-shop', partnerId: 'signify', icon: '💡', for: ['kmo'], name: 'Philips Light as a Service', detail: 'LED lighting for shop and workshop (± 40 fixtures)',
    monthly: 119, buyPrice: 6800, expectedRepairs: 1200, termMonths: 60, co2Kg: 2900, energySavingMonthly: 95, connected: true, payPerUse: true,
    includes: ['No upfront investment', 'Maintenance and repair by Philips', 'Fixtures report wear themselves', 'Option: pay per lit hour', 'Insurance via KBC', 'Take-back and recycling'] }),
  p({ id: 'lamp-office', partnerId: 'signify', icon: '🏢', for: ['kmo'], name: 'Philips office lighting', detail: 'Connected LED panels for open-plan offices (± 60 fixtures)',
    monthly: 149, buyPrice: 8400, expectedRepairs: 1300, termMonths: 60, co2Kg: 3400, energySavingMonthly: 120, connected: true, payPerUse: true,
    includes: ['Lighting plan and installation', 'Presence and daylight control', 'Maintenance and repair by Philips', 'Option: pay per lit hour', 'Take-back and recycling'] }),
  p({ id: 'lamp-warehouse', partnerId: 'signify', icon: '🏭', for: ['kmo'], name: 'Philips high-bay lighting', detail: 'LED high-bays for workshops and warehouses (± 24 fixtures)',
    monthly: 99, buyPrice: 5600, expectedRepairs: 900, termMonths: 60, co2Kg: 2600, energySavingMonthly: 85, connected: true, payPerUse: true,
    includes: ['Installation at height, no downtime', 'Fixtures report wear themselves', 'Repair or replacement within 48 hours', 'Take-back and recycling'] }),
  p({ id: 'lamp-parking', partnerId: 'signify', icon: '🅿️', for: ['kmo'], name: 'Philips car park and façade lighting', detail: 'Outdoor LED with dusk-to-dawn and presence control',
    monthly: 59, buyPrice: 3300, expectedRepairs: 500, termMonths: 60, co2Kg: 1100, energySavingMonthly: 40, connected: true,
    includes: ['Installation and commissioning', 'Dimmed when nobody is around', 'Maintenance and repair by Philips', 'Take-back and recycling'] }),

  // SolarLoop
  p({ id: 'solar', partnerId: 'solarloop', icon: '☀️', for: ['particulier', 'kmo'], name: 'Solar panels', detail: '8 panels, ± 3.2 kWp',
    monthly: 39, buyPrice: 5200, expectedRepairs: 400, termMonths: 120, co2Kg: 600, connected: true,
    includes: ['No upfront investment', 'Monitoring and repair', 'Inverter replacement included', 'Panels are recycled'] }),
  p({ id: 'solar-balcony', partnerId: 'solarloop', icon: '🌤️', for: ['particulier'], name: 'Balcony solar kit', detail: '2 plug-in panels, 800 W, for flats and terraces',
    monthly: 8, buyPrice: 899, expectedRepairs: 80, termMonths: 120, co2Kg: 120, connected: true,
    includes: ['Delivered ready to plug in', 'Mounting brackets for railing or wall', 'Yield shown in the app', 'Panels are recycled'] }),
  p({ id: 'solar-xl', partnerId: 'solarloop', icon: '☀️', for: ['particulier'], name: 'Solar panels XL', detail: '14 panels, ± 6 kWp, for larger homes',
    monthly: 65, buyPrice: 8600, expectedRepairs: 650, termMonths: 120, co2Kg: 1050, connected: true,
    includes: ['No upfront investment', 'Roof inspection and installation', 'Monitoring and repair', 'Inverter replacement included', 'Panels are recycled'] }),
  p({ id: 'solar-business', partnerId: 'solarloop', icon: '🏭', for: ['kmo'], name: 'Rooftop solar for business', detail: '40 panels, ± 17 kWp, with energy monitoring',
    monthly: 179, buyPrice: 21500, expectedRepairs: 1800, termMonths: 120, co2Kg: 4200, energySavingMonthly: 210, connected: true,
    includes: ['No upfront investment', 'Structural check and installation', 'Yield guarantee with monitoring', 'Inverter replacement included', 'Panels are recycled'] }),

  // VoltBox
  p({ id: 'battery', partnerId: 'voltbox', icon: '🔋', for: ['particulier'], name: 'Home battery', detail: '5 kWh',
    monthly: 29, buyPrice: 3900, expectedRepairs: 300, termMonths: 120, co2Kg: 300, connected: true,
    includes: ['Installation', 'Smart control with your solar panels', 'Second life as community storage'] }),
  p({ id: 'battery-large', partnerId: 'voltbox', icon: '🔋', for: ['particulier'], name: 'Home battery XL', detail: '10 kWh, with backup power during outages',
    monthly: 49, buyPrice: 6900, expectedRepairs: 450, termMonths: 120, co2Kg: 550, connected: true,
    includes: ['Installation', 'Backup power for essential circuits', 'Smart control with your solar panels', 'Second life as community storage'] }),
  p({ id: 'ev-charger', partnerId: 'voltbox', icon: '🔌', for: ['particulier'], name: 'Home EV charger', detail: '11 kW smart wallbox with solar charging',
    monthly: 17, buyPrice: 1450, expectedRepairs: 250, termMonths: 96, co2Kg: 90, connected: true,
    includes: ['Installation and inspection', 'Charges on surplus solar power', 'Company-car cost reimbursement report', 'Repair or replacement within 48 hours'] }),
  p({ id: 'energy-hub', partnerId: 'voltbox', icon: '📟', for: ['particulier'], name: 'Smart energy manager', detail: 'Steers battery, heat pump and charger to the cheapest tariff',
    monthly: 6, buyPrice: 549, expectedRepairs: 80, termMonths: 72, co2Kg: 60, connected: true,
    includes: ['Installation in your fuse box', 'Works with dynamic energy tariffs', 'Monthly savings report', 'Software updates included'] }),
  p({ id: 'ev-charger-business', partnerId: 'voltbox', icon: '🔌', for: ['kmo'], name: 'Business EV charge points', detail: '4 × 22 kW charge points with driver billing',
    monthly: 89, buyPrice: 8200, expectedRepairs: 1200, termMonths: 96, co2Kg: 600, connected: true, payPerUse: true,
    includes: ['Installation and load balancing', 'Billing per kWh for staff and visitors', 'Remote monitoring and repair', 'Second life for components'] }),

  // HeatShift
  p({ id: 'heat-pump', partnerId: 'heatshift', icon: '♨️', for: ['particulier'], name: 'Air-to-water heat pump', detail: '8 kW, replaces a gas boiler',
    monthly: 75, buyPrice: 12500, expectedRepairs: 1500, termMonths: 180, co2Kg: 900, energySavingMonthly: 45, connected: true,
    includes: ['Heat-loss calculation and installation', 'Annual service included', 'Remote fault detection', 'Refrigerant recovered at end of life'] }),
  p({ id: 'heat-pump-business', partnerId: 'heatshift', icon: '♨️', for: ['kmo'], name: 'Commercial heat pump', detail: '30 kW for shops, offices and workshops',
    monthly: 219, buyPrice: 38000, expectedRepairs: 4000, termMonths: 180, co2Kg: 2600, energySavingMonthly: 160, connected: true,
    includes: ['Engineering study and installation', 'Twice-yearly service', 'Remote monitoring and fault detection', 'Refrigerant recovered at end of life'] }),

  // ── Appliances ──────────────────────────────────────────────────────────────────────────────
  // WashCycle
  p({ id: 'washer', partnerId: 'washcycle', icon: '🫧', for: ['particulier'], name: 'Washing machine', detail: 'A-rated, 8 kg',
    monthly: 19.9, buyPrice: 1099, expectedRepairs: 350, termMonths: 60, co2Kg: 160,
    includes: ['Delivery and installation', 'Repair within 48 hours', 'Parts are reused', 'Take-back'] }),
  p({ id: 'dryer', partnerId: 'washcycle', icon: '🌀', for: ['particulier'], name: 'Heat-pump dryer', detail: 'A+++, 8 kg',
    monthly: 14, buyPrice: 749, expectedRepairs: 200, termMonths: 60, co2Kg: 150,
    includes: ['Delivery and installation', 'Repair within 48 hours', 'Parts are reused', 'Take-back'] }),
  p({ id: 'washer-dryer', partnerId: 'washcycle', icon: '🫧', for: ['particulier'], name: 'Washer-dryer', detail: 'A-rated, 9 kg wash / 6 kg dry, for smaller spaces',
    monthly: 18, buyPrice: 999, expectedRepairs: 260, termMonths: 60, co2Kg: 190,
    includes: ['Delivery and installation', 'Repair within 48 hours', 'Parts are reused', 'Take-back'] }),
  p({ id: 'dishwasher', partnerId: 'washcycle', icon: '🍽️', for: ['particulier'], name: 'Dishwasher', detail: 'Built-in, A-rated, 14 place settings',
    monthly: 13, buyPrice: 699, expectedRepairs: 180, termMonths: 60, co2Kg: 140,
    includes: ['Delivery and built-in installation', 'Repair within 48 hours', 'Parts are reused', 'Take-back'] }),
  p({ id: 'washer-pro', partnerId: 'washcycle', icon: '🧺', for: ['kmo'], name: 'Professional washer and dryer', detail: 'Commercial 10 kg set for salons, gyms and kitchens',
    monthly: 79, buyPrice: 5400, expectedRepairs: 1100, termMonths: 72, co2Kg: 450, payPerUse: true,
    includes: ['Delivery, installation and staff training', 'Technician within 24 hours', 'Option: pay per wash cycle', 'Parts are reused'] }),
  p({ id: 'dishwasher-pro', partnerId: 'washcycle', icon: '🍽️', for: ['kmo'], name: 'Commercial pass-through dishwasher', detail: '60-second cycles, for restaurants and bakeries',
    monthly: 69, buyPrice: 4600, expectedRepairs: 900, termMonths: 72, co2Kg: 380,
    includes: ['Installation with water softener', 'Technician within 24 hours', 'Annual hygiene inspection', 'Parts are reused'] }),

  // CoolCircle
  p({ id: 'fridge', partnerId: 'coolcircle', icon: '🧊', for: ['particulier'], name: 'Fridge-freezer', detail: 'Combi, A-rated',
    monthly: 12, buyPrice: 799, expectedRepairs: 180, termMonths: 60, co2Kg: 200,
    includes: ['Delivery and installation', 'Repair within 48 hours', 'Refrigerants safely processed'] }),
  p({ id: 'freezer', partnerId: 'coolcircle', icon: '❄️', for: ['particulier'], name: 'Upright freezer', detail: 'A-rated, 240 L, frost-free',
    monthly: 10, buyPrice: 649, expectedRepairs: 140, termMonths: 60, co2Kg: 170,
    includes: ['Delivery and installation', 'Repair within 48 hours', 'Refrigerants safely processed'] }),
  p({ id: 'fridge-display', partnerId: 'coolcircle', icon: '🥐', for: ['kmo'], name: 'Refrigerated display counter', detail: '1.5 m, for bakeries, butchers and delis',
    monthly: 89, buyPrice: 5900, expectedRepairs: 1100, termMonths: 72, co2Kg: 650, connected: true,
    includes: ['Delivery and installation', 'Temperature alarms to your phone', 'Technician within 24 hours', 'Refrigerants safely processed'] }),
  p({ id: 'fridge-pro', partnerId: 'coolcircle', icon: '🧊', for: ['kmo'], name: 'Commercial upright fridge', detail: 'Stainless steel, 600 L, for professional kitchens',
    monthly: 45, buyPrice: 2900, expectedRepairs: 600, termMonths: 72, co2Kg: 300, connected: true,
    includes: ['Delivery and installation', 'Temperature logging for food safety', 'Technician within 24 hours', 'Refrigerants safely processed'] }),

  // BrewBack
  p({ id: 'coffee', partnerId: 'brewback', icon: '☕', for: ['particulier'], name: 'Espresso machine', detail: 'Bean-to-cup',
    monthly: 9, buyPrice: 549, expectedRepairs: 160, termMonths: 48, co2Kg: 60,
    includes: ['Annual service', 'Descaling included', 'Loan machine during repairs'] }),
  p({ id: 'coffee-barista', partnerId: 'brewback', icon: '☕', for: ['particulier'], name: 'Barista espresso machine', detail: 'Dual boiler with built-in grinder',
    monthly: 19, buyPrice: 1290, expectedRepairs: 260, termMonths: 60, co2Kg: 90,
    includes: ['Annual service', 'Descaling included', 'Online barista workshop', 'Loan machine during repairs'] }),
  p({ id: 'coffee-pro', partnerId: 'brewback', icon: '☕', for: ['kmo'], name: 'Professional coffee machine', detail: 'For shop or office',
    monthly: 49, buyPrice: 2900, expectedRepairs: 600, termMonths: 60, co2Kg: 180,
    includes: ['Servicing and descaling', 'Repair within 24 hours', 'Loan machine'] }),
  p({ id: 'coffee-office', partnerId: 'brewback', icon: '🫖', for: ['kmo'], name: 'Office coffee station', detail: 'Bean-to-cup for 20–50 people, billed per cup',
    monthly: 39, buyPrice: 2400, expectedRepairs: 500, termMonths: 60, co2Kg: 140, connected: true, payPerUse: true,
    includes: ['Installation and water connection', 'Option: pay per cup', 'Machine reports service needs itself', 'Loan machine during repairs'] }),
  p({ id: 'coffee-espresso-pro', partnerId: 'brewback', icon: '☕', for: ['kmo'], name: 'Two-group espresso machine', detail: 'Traditional, for cafés and restaurants',
    monthly: 69, buyPrice: 4800, expectedRepairs: 900, termMonths: 72, co2Kg: 260,
    includes: ['Installation and barista training', 'Servicing and descaling', 'Technician within 24 hours', 'Loan machine'] }),
  p({ id: 'water-cooler', partnerId: 'brewback', icon: '💧', for: ['kmo'], name: 'Filtered water dispenser', detail: 'Chilled and sparkling, mains-fed',
    monthly: 25, buyPrice: 1390, expectedRepairs: 280, termMonths: 60, co2Kg: 90,
    includes: ['Installation on the water mains', 'Filter changes and sanitising', 'Replaces single-use bottles', 'Repair within 48 hours'] }),

  // ── Electronics ─────────────────────────────────────────────────────────────────────────────
  // ReFone
  p({ id: 'phone', partnerId: 'refone', icon: '📱', for: ['particulier', 'kmo'], name: 'Smartphone', detail: 'Refurbished flagship, 128 GB',
    monthly: 29, buyPrice: 899, expectedRepairs: 180, insuranceMonthly: 9, termMonths: 36, co2Kg: 55,
    includes: ['Free repairs', 'Damage insurance via KBC', 'Upgrade after 24 months', 'Your old phone gets refurbished'] }),
  p({ id: 'phone-essential', partnerId: 'refone', icon: '📱', for: ['particulier', 'kmo'], name: 'Smartphone Essential', detail: 'Refurbished mid-range, 128 GB',
    monthly: 15, buyPrice: 449, expectedRepairs: 120, insuranceMonthly: 5, termMonths: 36, co2Kg: 45,
    includes: ['Free repairs', 'Damage insurance via KBC', 'New battery included', 'Your old phone gets refurbished'] }),
  p({ id: 'phone-pro', partnerId: 'refone', icon: '📱', for: ['particulier', 'kmo'], name: 'Smartphone Pro', detail: 'Refurbished top model, 256 GB, triple camera',
    monthly: 42, buyPrice: 1349, expectedRepairs: 220, insuranceMonthly: 11, termMonths: 36, co2Kg: 65,
    includes: ['Free repairs, at your door', 'Damage and theft insurance via KBC', 'Upgrade after 24 months', 'Your old phone gets refurbished'] }),
  p({ id: 'tablet', partnerId: 'refone', icon: '📲', for: ['particulier', 'kmo'], name: 'Tablet with keyboard', detail: '11-inch, refurbished, with keyboard case',
    monthly: 19, buyPrice: 649, expectedRepairs: 110, insuranceMonthly: 5, termMonths: 36, co2Kg: 70,
    includes: ['Free repairs', 'Damage insurance via KBC', 'Keyboard case included', 'Data securely wiped on return'] }),
  p({ id: 'phone-fleet', partnerId: 'refone', icon: '📶', for: ['kmo'], name: 'Business smartphone fleet', detail: '10 refurbished smartphones with device management',
    monthly: 249, buyPrice: 7990, expectedRepairs: 1500, insuranceMonthly: 80, termMonths: 36, co2Kg: 520,
    includes: ['Pre-configured with your company apps', 'Swap device within 24 hours', 'Damage insurance via KBC', 'Add or remove devices monthly', 'Data securely wiped on return'] }),

  // ReLapt
  p({ id: 'laptop', partnerId: 'relapt', icon: '💻', for: ['particulier', 'kmo'], name: 'Laptop', detail: '14-inch, refurbished, 16 GB',
    monthly: 24, buyPrice: 1099, expectedRepairs: 150, termMonths: 36, co2Kg: 250,
    includes: ['Repair or replacement device within 24 hours', 'Battery replaced instead of a new laptop', 'Data securely wiped on return'] }),
  p({ id: 'laptop-student', partnerId: 'relapt', icon: '🎒', for: ['particulier'], name: 'Student laptop', detail: '13-inch, refurbished, 8 GB, all-day battery',
    monthly: 14, buyPrice: 599, expectedRepairs: 100, termMonths: 36, co2Kg: 180,
    includes: ['Repair or replacement device within 24 hours', 'Accidental damage covered', 'Office software included', 'Data securely wiped on return'] }),
  p({ id: 'laptop-pro', partnerId: 'relapt', icon: '💻', for: ['particulier', 'kmo'], name: 'Performance laptop', detail: '16-inch, refurbished, 32 GB, for creative work',
    monthly: 45, buyPrice: 2199, expectedRepairs: 250, termMonths: 36, co2Kg: 320,
    includes: ['Repair or replacement device within 24 hours', 'Memory and storage upgrades on request', 'Battery replaced instead of a new laptop', 'Data securely wiped on return'] }),
  p({ id: 'laptop-fleet', partnerId: 'relapt', icon: '🗂️', for: ['kmo'], name: 'Business laptop fleet', detail: '10 refurbished 14-inch laptops, managed and imaged',
    monthly: 219, buyPrice: 9990, expectedRepairs: 1200, termMonths: 36, co2Kg: 2300,
    includes: ['Delivered with your company image', 'Replacement device next business day', 'Add or remove laptops monthly', 'Certified data wiping on return'] }),
  p({ id: 'printer-mfp', partnerId: 'relapt', icon: '🖨️', for: ['kmo'], name: 'Office multifunction printer', detail: 'Colour A3 print, scan and copy',
    monthly: 29, buyPrice: 1890, expectedRepairs: 450, termMonths: 60, co2Kg: 210, connected: true, payPerUse: true,
    includes: ['Toner delivered automatically', 'Option: pay per printed page', 'Technician within 24 hours', 'Refurbished at end of contract'] }),

  // PixelLoop
  p({ id: 'tv', partnerId: 'pixelloop', icon: '📺', for: ['particulier'], name: 'TV 55"', detail: '4K, refurbished',
    monthly: 14, buyPrice: 799, expectedRepairs: 120, termMonths: 48, co2Kg: 300,
    includes: ['Delivery and wall mounting', 'Repair at home', 'Parts reused'] }),
  p({ id: 'tv-65', partnerId: 'pixelloop', icon: '📺', for: ['particulier'], name: 'TV 65"', detail: '4K OLED, refurbished',
    monthly: 25, buyPrice: 1499, expectedRepairs: 200, termMonths: 48, co2Kg: 380,
    includes: ['Delivery and wall mounting', 'Repair at home', 'Upgrade to a newer model after 24 months', 'Parts reused'] }),
  p({ id: 'soundbar', partnerId: 'pixelloop', icon: '🔊', for: ['particulier'], name: 'Soundbar with subwoofer', detail: 'Dolby Atmos, refurbished',
    monthly: 9, buyPrice: 449, expectedRepairs: 60, termMonths: 48, co2Kg: 60,
    includes: ['Delivery and setup', 'Repair or swap within 48 hours', 'Parts reused'] }),
  p({ id: 'monitor', partnerId: 'pixelloop', icon: '🖥️', for: ['particulier', 'kmo'], name: 'Monitor 27"', detail: 'QHD, USB-C docking, refurbished',
    monthly: 8, buyPrice: 349, expectedRepairs: 50, termMonths: 48, co2Kg: 90,
    includes: ['Delivery with monitor arm', 'Swap within 48 hours', 'Parts reused'] }),
  p({ id: 'display-signage', partnerId: 'pixelloop', icon: '🪧', for: ['kmo'], name: 'Digital signage screen', detail: '55-inch shop-window display with content player',
    monthly: 39, buyPrice: 1990, expectedRepairs: 300, termMonths: 48, co2Kg: 260, connected: true,
    includes: ['Installation in your shop window', 'Content scheduling software', 'Screen reports faults itself', 'Parts reused'] }),
  p({ id: 'meeting-display', partnerId: 'pixelloop', icon: '🧑‍💻', for: ['kmo'], name: 'Meeting-room display', detail: '65-inch touchscreen with video conferencing',
    monthly: 59, buyPrice: 3290, expectedRepairs: 400, termMonths: 48, co2Kg: 340,
    includes: ['Installation with camera and speakerbar', 'Works with common video-call tools', 'Repair or swap within 48 hours', 'Parts reused'] }),

  // ── Mobility ────────────────────────────────────────────────────────────────────────────────
  // PedalPool
  p({ id: 'ebike', partnerId: 'pedalpool', icon: '🚲', for: ['particulier'], name: 'E-bike', detail: 'Mid-drive motor, 500 Wh',
    monthly: 45, buyPrice: 2799, expectedRepairs: 450, insuranceMonthly: 8, termMonths: 48, co2Kg: 150,
    includes: ['Servicing twice a year', 'Roadside assistance', 'Theft insurance via KBC', 'Battery reused'] }),
  p({ id: 'ebike-city', partnerId: 'pedalpool', icon: '🚲', for: ['particulier'], name: 'City e-bike', detail: 'Hub motor, 400 Wh, step-through frame',
    monthly: 32, buyPrice: 1899, expectedRepairs: 350, insuranceMonthly: 6, termMonths: 48, co2Kg: 120,
    includes: ['Servicing twice a year', 'Roadside assistance', 'Theft insurance via KBC', 'Battery reused'] }),
  p({ id: 'speed-pedelec', partnerId: 'pedalpool', icon: '⚡', for: ['particulier', 'kmo'], name: 'Speed pedelec', detail: 'Up to 45 km/h, 750 Wh, for commuters',
    monthly: 89, buyPrice: 5499, expectedRepairs: 800, insuranceMonthly: 15, termMonths: 48, co2Kg: 300,
    includes: ['Registration and number plate arranged', 'Servicing twice a year', 'Roadside assistance', 'Theft insurance via KBC'] }),
  p({ id: 'cargo', partnerId: 'pedalpool', icon: '🛺', for: ['particulier'], name: 'Electric cargo bike', detail: 'Seats 2 children',
    monthly: 69, buyPrice: 4200, expectedRepairs: 600, insuranceMonthly: 10, termMonths: 48, co2Kg: 200,
    includes: ['Servicing twice a year', 'Roadside assistance', 'Theft insurance via KBC'] }),
  p({ id: 'kids-bike', partnerId: 'pedalpool', icon: '🚴', for: ['particulier'], name: 'Kids’ bike that grows along', detail: 'Swap to the next size as your child grows (16–26 inch)',
    monthly: 9, buyPrice: 349, expectedRepairs: 60, termMonths: 24, co2Kg: 30,
    includes: ['Free swap to the next size', 'Safety check at every swap', 'Helmet included', 'Returned bikes go to the next family'] }),

  // CargoCrew
  p({ id: 'cargo-delivery', partnerId: 'cargocrew', icon: '📦', for: ['kmo'], name: 'Electric delivery cargo bike', detail: 'Lockable 1.5 m³ box, 200 kg payload',
    monthly: 149, buyPrice: 8900, expectedRepairs: 1300, insuranceMonthly: 18, termMonths: 60, co2Kg: 900,
    includes: ['Branding with your logo', 'Servicing at your premises', 'Replacement bike within 24 hours', 'Theft insurance via KBC'] }),
  p({ id: 'cargo-trike', partnerId: 'cargocrew', icon: '🛺', for: ['kmo'], name: 'Refrigerated cargo trike', detail: 'Insulated box for fresh food deliveries',
    monthly: 179, buyPrice: 11500, expectedRepairs: 1600, insuranceMonthly: 20, termMonths: 60, co2Kg: 1100,
    includes: ['Cooled box with temperature logging', 'Servicing at your premises', 'Replacement bike within 24 hours', 'Theft insurance via KBC'] }),
  p({ id: 'cargo-pro', partnerId: 'cargocrew', icon: '🧰', for: ['kmo'], name: 'Cargo bike for tradespeople', detail: 'Tool rack and 100 kg payload, for urban service calls',
    monthly: 119, buyPrice: 5900, expectedRepairs: 900, insuranceMonthly: 12, termMonths: 48, co2Kg: 500,
    includes: ['Lockable tool and ladder rack', 'Servicing at your premises', 'Roadside assistance', 'Theft insurance via KBC'] }),
  p({ id: 'ebike-fleet', partnerId: 'cargocrew', icon: '🚲', for: ['kmo'], name: 'Company e-bike fleet', detail: '5 e-bikes for staff, with on-site servicing',
    monthly: 289, buyPrice: 13995, expectedRepairs: 2250, insuranceMonthly: 40, termMonths: 48, co2Kg: 750,
    includes: ['Fleet dashboard and booking app', 'On-site servicing twice a year', 'Roadside assistance', 'Theft insurance via KBC'] }),

  // ── Family & baby ───────────────────────────────────────────────────────────────────────────
  // BabyCycle
  p({ id: 'stroller', partnerId: 'babycycle', icon: '👶', for: ['particulier'], name: 'Stroller', detail: 'Travel system with carrycot',
    monthly: 15, buyPrice: 899, expectedRepairs: 80, termMonths: 24, co2Kg: 60,
    includes: ['Thoroughly cleaned and inspected', 'Repairs included', 'Goes to the next family afterwards'] }),
  p({ id: 'carseat', partnerId: 'babycycle', icon: '🧸', for: ['particulier'], name: 'Car seat', detail: 'Grows with your child, i-Size',
    monthly: 8, buyPrice: 349, termMonths: 48, co2Kg: 25,
    includes: ['Free swap to the next size', 'Replacement after an accident', 'Safety check on return'] }),
  p({ id: 'cot', partnerId: 'babycycle', icon: '🛏️', for: ['particulier'], name: 'Convertible cot', detail: 'Solid wood, becomes a toddler bed, new mattress included',
    monthly: 9, buyPrice: 449, expectedRepairs: 30, termMonths: 36, co2Kg: 70,
    includes: ['Delivery and assembly', 'Brand-new mattress for every family', 'Conversion kit to toddler bed', 'Goes to the next family afterwards'] }),
  p({ id: 'bike-trailer', partnerId: 'babycycle', icon: '🚸', for: ['particulier'], name: 'Bike trailer for two', detail: 'Converts to a jogging stroller',
    monthly: 12, buyPrice: 699, expectedRepairs: 90, termMonths: 36, co2Kg: 40,
    includes: ['Hitch for your bike included', 'Thoroughly cleaned and inspected', 'Repairs included', 'Goes to the next family afterwards'] }),

  // ── For your business ───────────────────────────────────────────────────────────────────────
  // DeskLoop
  p({ id: 'desk', partnerId: 'deskloop', icon: '🪑', for: ['kmo'], name: 'Office fit-out', detail: '6 complete workstations',
    monthly: 79, buyPrice: 4500, expectedRepairs: 300, termMonths: 60, co2Kg: 700,
    includes: ['Assembly and removal', 'Scale up or down every month', 'Furniture is refurbished'] }),
  p({ id: 'desk-sitstand', partnerId: 'deskloop', icon: '🧍', for: ['kmo'], name: 'Sit-stand desks', detail: 'Set of 6 electric height-adjustable desks',
    monthly: 59, buyPrice: 3600, expectedRepairs: 300, termMonths: 60, co2Kg: 520,
    includes: ['Delivery and assembly', 'Motor repaired or replaced within 48 hours', 'Scale up or down every month', 'Furniture is refurbished'] }),
  p({ id: 'chairs-ergo', partnerId: 'deskloop', icon: '💺', for: ['kmo'], name: 'Ergonomic office chairs', detail: 'Set of 6, refurbished, fully adjustable',
    monthly: 39, buyPrice: 2700, expectedRepairs: 250, termMonths: 60, co2Kg: 380,
    includes: ['Ergonomic set-up per employee', 'Upholstery and parts replaced', 'Scale up or down every month', 'Furniture is refurbished'] }),
  p({ id: 'meeting-room', partnerId: 'deskloop', icon: '🗣️', for: ['kmo'], name: 'Meeting room set', detail: 'Table for 8, chairs and acoustic wall panels',
    monthly: 69, buyPrice: 4200, expectedRepairs: 300, termMonths: 60, co2Kg: 600,
    includes: ['Room layout advice', 'Assembly and removal', 'Panels made from recycled PET', 'Furniture is refurbished'] }),
  p({ id: 'phone-booth', partnerId: 'deskloop', icon: '🚪', for: ['kmo'], name: 'Acoustic phone booth', detail: 'Single-person, ventilated and lit',
    monthly: 45, buyPrice: 3200, expectedRepairs: 250, termMonths: 72, co2Kg: 400,
    includes: ['Delivery and assembly', 'Ventilation and lighting serviced', 'Moves with you to a new office', 'Refurbished for the next user'] }),

  // TradeCycle
  p({ id: 'pos-system', partnerId: 'tradecycle', icon: '🧾', for: ['kmo'], name: 'Point-of-sale system', detail: 'Touchscreen till, receipt printer and card terminal',
    monthly: 35, buyPrice: 1590, expectedRepairs: 250, termMonths: 48, co2Kg: 110, connected: true,
    includes: ['Installation and staff training', 'Swap within one business day', 'Software updates included', 'Refurbished at end of contract'] }),
  p({ id: 'shop-shelving', partnerId: 'tradecycle', icon: '🛒', for: ['kmo'], name: 'Modular shop shelving', detail: '12 m of reconfigurable wall and gondola units',
    monthly: 59, buyPrice: 4400, expectedRepairs: 200, termMonths: 72, co2Kg: 900,
    includes: ['Store layout plan', 'Assembly and reconfiguration once a year', 'Extra units added monthly', 'Reused in the next shop'] }),
  p({ id: 'deck-oven', partnerId: 'tradecycle', icon: '🍞', for: ['kmo'], name: 'Professional deck oven', detail: '3 decks, electric, with steam injection',
    monthly: 165, buyPrice: 14500, expectedRepairs: 2400, termMonths: 96, co2Kg: 1400, energySavingMonthly: 35, connected: true,
    includes: ['Installation and commissioning', 'Annual service and safety check', 'Technician within 24 hours', 'Refurbished at end of contract'] }),
  p({ id: 'floor-scrubber', partnerId: 'tradecycle', icon: '🧽', for: ['kmo'], name: 'Battery floor scrubber', detail: 'Walk-behind, for shops, workshops and warehouses',
    monthly: 49, buyPrice: 3200, expectedRepairs: 600, termMonths: 72, co2Kg: 250,
    includes: ['Delivery and operator training', 'Brushes and pads replaced', 'Repair within 48 hours', 'Batteries get a second life'] }),
]

// Bundles combine products from several partners (price is calculated in engine/catalog.js).
export const bundles = [
  {
    id: 'bundle-home', icon: '🏠', for: [],
    name: 'New home starter pack', detail: 'Philips lighting + washing machine + fridge-freezer',
    items: ['lamp-home', 'washer', 'fridge'], termMonths: 60,
  },
]
