// Links KBC Loop to existing KBC services (see data/kbcServices.js).
import { kbcServices, loopSteps, categoryServices } from '../data/kbcServices.js'
import { categoryOf } from './catalog.js'

export function serviceById(id) {
  const s = kbcServices[id]
  if (!s) throw new Error(`Unknown KBC service: ${id}`)
  return { id, ...s }
}

function insuranceFor(categoryId, customerType) {
  if (categoryId === 'mobiliteit') return 'bicycleInsurance'
  if (categoryId === 'zaak' || (customerType === 'kmo' && (categoryId === 'energie' || categoryId === 'toestellen'))) return 'officeInsurance'
  if (categoryId === 'energie' || categoryId === 'toestellen') return 'homeInsurance'
  return null
}

/** Which existing KBC services arrange this product behind the scenes? */
export function productServices(product, customerType) {
  const cat = categoryOf(product)
  return [
    { role: 'Financing', id: 'b2bAsset' },
    product.payPerUse && { role: 'Pay per use', id: 'm2m' },
    insuranceFor(cat.id, customerType) && { role: 'Insurance', id: insuranceFor(cat.id, customerType) },
    { role: 'Buy out in instalments', id: 'instalmentHub' },
    { role: 'Reward', id: 'kateCoins' },
    { role: 'Impact', id: customerType === 'kmo' ? 'kubeEsg' : 'ecoWise' },
  ].filter(Boolean).map((r) => ({ ...r, ...serviceById(r.id) }))
}

export function servicesForCategory(categoryId) {
  return (categoryServices[categoryId] ?? []).map(serviceById)
}

export function servicesForSignal(signal) {
  return (signal.services ?? []).map(serviceById)
}

export function integrationMap() {
  const steps = loopSteps.map((s) => ({ ...s, services: s.services.map(serviceById) }))
  const unique = new Set(loopSteps.flatMap((s) => s.services))
  return { steps, reusedCount: unique.size }
}
