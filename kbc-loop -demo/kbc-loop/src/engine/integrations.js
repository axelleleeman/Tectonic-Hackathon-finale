// Koppelt KBC Loop aan bestaande KBC-diensten (zie data/kbcServices.js).
import { kbcServices, loopSteps, categoryServices } from '../data/kbcServices.js'
import { categoryOf } from './catalog.js'

export function serviceById(id) {
  const s = kbcServices[id]
  if (!s) throw new Error(`Onbekende KBC-dienst: ${id}`)
  return { id, ...s }
}

function insuranceFor(categoryId, customerType) {
  if (categoryId === 'mobiliteit') return 'bicycleInsurance'
  if (categoryId === 'zaak' || (customerType === 'kmo' && categoryId === 'energie')) return 'officeInsurance'
  if (categoryId === 'energie' || categoryId === 'toestellen') return 'homeInsurance'
  return null
}

/** Welke bestaande KBC-diensten regelen dit product achter de schermen? */
export function productServices(product, customerType) {
  const cat = categoryOf(product)
  return [
    { role: 'Financiering', id: 'b2bAsset' },
    product.payPerUse && { role: 'Betalen per gebruik', id: 'm2m' },
    insuranceFor(cat.id, customerType) && { role: 'Verzekering', id: insuranceFor(cat.id, customerType) },
    { role: 'Overnemen op afbetaling', id: 'instalmentHub' },
    { role: 'Beloning', id: 'kateCoins' },
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
