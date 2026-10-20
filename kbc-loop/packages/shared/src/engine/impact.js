// Impact calculations for My KBC and the dashboards.
import { productById } from './catalog.js'
import { CO2_KG_PER_CAR_KM } from '../config/index.js'

export function carKmEquivalent(co2Kg) {
  return Math.round(co2Kg / CO2_KG_PER_CAR_KM / 50) * 50
}

export function loopTotals(items) {
  const withProduct = items.map((i) => ({ ...i, product: productById(i.productId) }))
  const active = withProduct.filter((i) => !i.returned)
  const co2Kg = withProduct.reduce((s, i) => s + i.product.co2Kg, 0)
  return {
    active: active.length,
    returned: withProduct.length - active.length,
    repairs: withProduct.reduce((s, i) => s + i.repairs, 0),
    monthly: active.reduce((s, i) => s + i.product.monthly, 0),
    co2Kg,
    carKm: carKmEquivalent(co2Kg),
  }
}
