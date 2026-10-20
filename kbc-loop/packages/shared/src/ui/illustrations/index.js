// Product illustrations: one original, brand-free drawing per product type, shared by app and web.
// `illustrationFor(productOrId)` picks the right drawing for any catalogue product, using (in order)
// keyword rules on the product id, the same rules on its name, the emoji icon, the category, and
// finally a generic parcel. Specs are plain data, see kit.js for the format.
import { products, bundles, partners } from '../../data/index.js'
import { bikeTrailer } from './bikeTrailer.js'
import { bundle } from './bundle.js'
import { carSeat } from './carSeat.js'
import { cargoBike } from './cargoBike.js'
import { coffeeMachine } from './coffeeMachine.js'
import { coffeePro } from './coffeePro.js'
import { crib } from './crib.js'
import { desk } from './desk.js'
import { dishwasher } from './dishwasher.js'
import { displayCounter } from './displayCounter.js'
import { dryer } from './dryer.js'
import { ebike } from './ebike.js'
import { energyManager } from './energyManager.js'
import { evCharger } from './evCharger.js'
import { floorScrubber } from './floorScrubber.js'
import { freezer } from './freezer.js'
import { fridge } from './fridge.js'
import { generic } from './generic.js'
import { headphones } from './headphones.js'
import { heatPump } from './heatPump.js'
import { highChair } from './highChair.js'
import { homeBattery } from './homeBattery.js'
import { kidsBike } from './kidsBike.js'
import { lamp } from './lamp.js'
import { laptop } from './laptop.js'
import { meetingTable } from './meetingTable.js'
import { monitor } from './monitor.js'
import { officeChair } from './officeChair.js'
import { outdoorLight } from './outdoorLight.js'
import { oven } from './oven.js'
import { pendantLight } from './pendantLight.js'
import { phone } from './phone.js'
import { phoneBooth } from './phoneBooth.js'
import { posTerminal } from './posTerminal.js'
import { printer } from './printer.js'
import { scooter } from './scooter.js'
import { shelving } from './shelving.js'
import { signage } from './signage.js'
import { solarPanels } from './solarPanels.js'
import { soundbar } from './soundbar.js'
import { stroller } from './stroller.js'
import { tablet } from './tablet.js'
import { tv } from './tv.js'
import { vacuum } from './vacuum.js'
import { washer } from './washer.js'
import { waterDispenser } from './waterDispenser.js'

const all = [bikeTrailer, bundle, carSeat, cargoBike, coffeeMachine, coffeePro, crib, desk, dishwasher, displayCounter, dryer, ebike, energyManager, evCharger, floorScrubber, freezer, fridge, generic, headphones, heatPump, highChair, homeBattery, kidsBike, lamp, laptop, meetingTable, monitor, officeChair, outdoorLight, oven, pendantLight, phone, phoneBooth, posTerminal, printer, scooter, shelving, signage, solarPanels, soundbar, stroller, tablet, tv, vacuum, washer, waterDispenser]

/** All illustration specs by type id. */
export const illustrations = Object.fromEntries(all.map((spec) => [spec.type, spec]))

/** All illustration type ids. */
export const illustrationTypes = Object.keys(illustrations)

// Ordered: the first matching rule wins, so specific rules come before broad ones.
const RULES = [
  ['bundle', /bundle|starter pack/],
  ['phone-booth', /phone[- ]?booth|booth/],
  ['bike-trailer', /trailer/],
  ['display-counter', /display[- ]counter|fridge-display|refrigerated display|deli counter/],
  ['floor-scrubber', /scrubber|floor[- ]?clean/],
  ['vacuum', /vacuum|hoover/],
  ['dishwasher', /dish/],
  ['washer', /washer|washing|laundry/],
  ['dryer', /dryer|tumble/],
  ['water-dispenser', /water[- ]?(cooler|dispenser)|dispenser/],
  ['fridge', /fridge[- ]freezer|combi/],
  ['freezer', /freezer|upright/],
  ['fridge', /fridge|refrigerat/],
  ['coffee-pro', /coffee-pro|espresso-pro|two-group|barista|professional coffee|traditional espresso/],
  ['coffee-machine', /coffee|espresso|bean-to-cup/],
  ['oven', /oven|bakery/],
  ['heat-pump', /heat[- ]?pump|boiler|heating|air[- ]?con/],
  ['ev-charger', /charger|charge point|charging|wallbox/],
  ['energy-manager', /energy[- ]?(hub|manager)|smart meter|thermostat/],
  ['solar-panels', /solar|photovoltaic|\bpv\b/],
  ['home-battery', /battery|home storage/],
  ['outdoor-light', /outdoor|garden|parking|car park|street ?light|bollard/],
  ['pendant-light', /warehouse|high-?bay|lamp-shop|lamp-office|pendant|office lighting|light as a service/],
  ['lamp', /lamp|bulb|lighting|\bled\b/],
  ['printer', /print|mfp|copier|scanner/],
  ['soundbar', /soundbar|speaker|audio/],
  ['headphones', /headphone|headset|earbud|earphone/],
  ['signage', /signage|kiosk/],
  ['tv', /\btv\b|television|oled|meeting-display|meeting-room display/],
  ['monitor', /monitor|screen|display/],
  ['tablet', /tablet/],
  ['laptop', /laptop|notebook|computer/],
  ['phone', /phone|mobile/],
  ['kids-bike', /kids?[- ]bike|kids’ bike|balance bike|child.*bike/],
  ['cargo-bike', /cargo|trike|delivery bike/],
  ['scooter', /scooter|kick ?step/],
  ['ebike', /e-?bike|bike|pedelec|bicycle/],
  ['stroller', /stroller|pram|pushchair|buggy|travel system/],
  ['car-seat', /car[- ]?seat|booster/],
  ['high-chair', /high[- ]?chair/],
  ['crib', /\bcot\b|crib|cradle|bassinet|toddler bed/],
  ['office-chair', /chair|seating/],
  ['desk', /desk|workstation|fit-out|workplace/],
  ['meeting-table', /meeting|conference|table/],
  ['pos-terminal', /\bpos\b|point[- ]of[- ]sale|\btill\b|checkout|card terminal/],
  ['shelving', /shelv|gondola|racking/],
]

const ICONS = {
  '📱': 'phone', '📲': 'tablet', '💻': 'laptop', '🖥️': 'monitor', '📺': 'tv', '🔊': 'soundbar', '🎧': 'headphones',
  '🖨️': 'printer', '🫧': 'washer', '🧺': 'washer', '🍽️': 'dishwasher', '🧊': 'fridge', '❄️': 'freezer', '☕': 'coffee-machine',
  '💡': 'lamp', '☀️': 'solar-panels', '🔋': 'home-battery', '🔌': 'ev-charger', '♨️': 'heat-pump', '🚲': 'ebike',
  '🛺': 'cargo-bike', '🛴': 'scooter', '👶': 'stroller', '🪑': 'office-chair', '🛏️': 'crib', '🧸': 'car-seat',
}

// Fallback per category id (data/categories.js).
const CATEGORY_FALLBACK = {
  energie: 'solar-panels', toestellen: 'washer', elektronica: 'laptop', mobiliteit: 'ebike', gezin: 'stroller', zaak: 'desk',
}

const matchRules = (text) => {
  if (!text) return null
  const t = String(text).toLowerCase()
  return RULES.find(([, re]) => re.test(t))?.[0] ?? null
}

/** Resolve a product id to its catalogue entry (product or bundle); returns null when unknown. */
export function findProduct(id) {
  return products.find((p) => p.id === id) ?? bundles.find((b) => b.id === id) ?? null
}

/** The display name used as accessible label. */
export function productLabel(productOrId) {
  const product = typeof productOrId === 'string' ? findProduct(productOrId) : productOrId
  return product?.name ?? (typeof productOrId === 'string' ? productOrId : 'Product')
}

/** Illustration type id for a product (object or id). Never throws; falls back to 'generic'. */
export function illustrationTypeFor(productOrId) {
  const product = typeof productOrId === 'string' ? (findProduct(productOrId) ?? { id: productOrId }) : (productOrId ?? {})
  if (product.isBundle || product.items) return 'bundle'
  const category = product.category ?? partners[product.partnerId ?? product.partnerIds?.[0]]?.category
  return matchRules(product.id)
    ?? matchRules(product.name)
    ?? ICONS[product.icon]
    ?? CATEGORY_FALLBACK[category]
    ?? 'generic'
}

/** Illustration spec for a product (object or id). Always returns a spec. */
export function illustrationFor(productOrId) {
  return illustrations[illustrationTypeFor(productOrId)] ?? illustrations.generic
}
