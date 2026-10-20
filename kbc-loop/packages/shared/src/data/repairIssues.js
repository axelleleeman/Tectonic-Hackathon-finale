// Quick picks for "Report a fault", per product. Products without their own list get DEFAULT_ISSUES.

const LIGHT = ['Light flickers', 'Light no longer works', 'Sensor or control does not respond']
const SOLAR = ['Low or no yield in the app', 'Inverter shows an error', 'Panel visibly damaged']
const BATTERY = ['Battery does not charge', 'Error message on the display', 'Does not switch to backup power']
const CHARGER = ['Car does not start charging', 'Charging stops halfway', 'Card reader or app not working']
const HEAT_PUMP = ['No heating or hot water', 'Error code on the controller', 'Unusual noise from the outdoor unit']
const WASHER = ['Does not drain', 'Leaks water', 'Does not start']
const DRYER = ['Clothes stay damp', 'Does not start', 'Water tank or filter error']
const DISHWASHER = ['Dishes not clean', 'Does not drain', 'Leaks water']
const COOLING = ['Not cooling enough', 'Ice build-up', 'Door does not close properly']
const COFFEE = ['Coffee runs too slowly', 'Descaling warning will not clear', 'Leaks water']
const PHONE = ['Cracked screen', 'Battery drains quickly', 'No longer charges']
const LAPTOP = ['Battery worn out', 'Keyboard faulty', 'Does not boot']
const SCREEN = ['No picture', 'Lines or spots on the screen', 'No sound']
const BIKE = ['Motor does not assist', 'Battery does not charge', 'Brakes need adjusting', 'Flat tyre']
const BABY = ['Wheel or brake damaged', 'Fabric torn or stained', 'Folding mechanism stuck']
const FURNITURE = ['Height adjustment does not work', 'Part broken or loose', 'Want to add or remove units']

export const repairIssues = {
  'lamp-home': LIGHT,
  'lamp-outdoor': ['Light no longer works', 'Motion sensor does not respond', 'Water inside the fitting'],
  'lamp-shop': ['Fixture faulty', 'Sensor not working', 'Flickering in the shop'],
  'lamp-office': ['Panel faulty', 'Presence sensor not working', 'Flickering in the office'],
  'lamp-warehouse': ['High-bay fixture faulty', 'Sensor not working', 'Light level too low'],
  'lamp-parking': ['Fixture faulty', 'Lights stay on during the day', 'Presence sensor not working'],
  solar: SOLAR,
  'solar-balcony': ['Low or no yield in the app', 'Plug or cable damaged', 'Mounting bracket loose'],
  'solar-xl': SOLAR,
  'solar-business': SOLAR,
  battery: BATTERY,
  'battery-large': BATTERY,
  'energy-hub': ['Devices no longer controlled', 'Offline in the app', 'Wrong tariff data'],
  'ev-charger': CHARGER,
  'ev-charger-business': CHARGER,
  'heat-pump': HEAT_PUMP,
  'heat-pump-business': HEAT_PUMP,
  washer: WASHER,
  'washer-dryer': WASHER,
  'washer-pro': WASHER,
  dryer: DRYER,
  dishwasher: DISHWASHER,
  'dishwasher-pro': DISHWASHER,
  fridge: COOLING,
  freezer: COOLING,
  'fridge-pro': ['Temperature alarm', ...COOLING.slice(0, 2)],
  'fridge-display': ['Temperature alarm', 'Glass fogs up', 'Lighting faulty'],
  coffee: COFFEE,
  'coffee-barista': [...COFFEE, 'Grinder jammed'],
  'coffee-pro': COFFEE,
  'coffee-office': ['Payment or cup counter not working', ...COFFEE],
  'coffee-espresso-pro': ['Steam wand not working', ...COFFEE],
  'water-cooler': ['Water not cold', 'No sparkling water', 'Leaks water'],
  phone: PHONE,
  'phone-essential': PHONE,
  'phone-pro': PHONE,
  'phone-fleet': [...PHONE, 'Device lost or stolen'],
  tablet: ['Cracked screen', 'Keyboard case not connecting', 'No longer charges'],
  laptop: LAPTOP,
  'laptop-student': LAPTOP,
  'laptop-pro': LAPTOP,
  'laptop-fleet': [...LAPTOP, 'New employee needs a device'],
  'printer-mfp': ['Paper jam', 'Print quality poor', 'Scanner not working'],
  tv: SCREEN,
  'tv-65': SCREEN,
  monitor: ['No picture', 'USB-C docking not working', 'Dead pixels'],
  soundbar: ['No sound', 'Subwoofer not connecting', 'Remote does not work'],
  'display-signage': ['Screen stays black', 'Content not updating', 'Too dim in sunlight'],
  'meeting-display': ['Touchscreen not responding', 'Camera or microphone not working', 'Cannot share screen'],
  ebike: BIKE,
  'ebike-city': BIKE,
  'speed-pedelec': BIKE,
  cargo: BIKE,
  'ebike-fleet': BIKE,
  'cargo-delivery': [...BIKE.slice(0, 2), 'Box lock broken'],
  'cargo-trike': [...BIKE.slice(0, 2), 'Cooling box not cold enough'],
  'cargo-pro': [...BIKE.slice(0, 2), 'Tool rack damaged'],
  'kids-bike': ['Needs the next size', 'Brakes need adjusting', 'Flat tyre'],
  stroller: BABY,
  'bike-trailer': BABY,
  carseat: ['Needs the next size', 'Buckle or harness faulty', 'Involved in an accident'],
  cot: ['Part broken or loose', 'Ready to convert to toddler bed', 'Mattress needs replacing'],
  desk: FURNITURE,
  'desk-sitstand': FURNITURE,
  'chairs-ergo': ['Gas lift sinks', 'Armrest or wheel broken', 'Upholstery worn'],
  'meeting-room': ['Part broken or loose', 'Acoustic panel damaged', 'Want to reconfigure the room'],
  'phone-booth': ['Ventilation not working', 'Lighting not working', 'Door does not close properly'],
  'pos-system': ['Card terminal not working', 'Receipt printer jammed', 'Till does not start'],
  'shop-shelving': ['Shelf damaged', 'Want to reconfigure the layout', 'Need extra units'],
  'deck-oven': ['Does not reach temperature', 'Steam injection not working', 'Error code on the controller'],
  'floor-scrubber': ['Leaves streaks', 'Battery does not charge', 'Does not pick up water'],
}

export const DEFAULT_ISSUES = ['No longer works', 'Makes an unusual noise', 'Something else']

export const issuesFor = (productId) => repairIssues[productId] ?? DEFAULT_ISSUES

export const PREVENTIVE_ISSUE = 'Preventive: wear reported by the light itself'
