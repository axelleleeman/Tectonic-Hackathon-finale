// Partner portal model: open repair tickets and KPIs for one partner, across all customers in the shared state.
// Live figures are added on top of a small fictional pilot base, so the portal never looks empty.
import { customers, partners, partnerPilot } from '@kbc-loop/shared/data/index.js'
import { productById } from '@kbc-loop/shared/engine/catalog.js'

/** Partner flow on a ticket, in order (statuses of PARTNER_UPDATE_REPAIR). */
export const TICKET_FLOW = [
  { status: 'scheduled', action: 'Schedule', label: 'Scheduled' },
  { status: 'on-the-way', action: 'On the way', label: 'On the way' },
  { status: 'in-progress', action: 'In progress', label: 'In progress' },
  { status: 'repaired', action: 'Repaired', label: 'Repaired' },
]

export const partnerList = Object.values(partners)

// Small deterministic number per partner id (pilot base for partners without pilot figures)
const seed = (id) => [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 997, 7)

function itemsOfPartner(state, partnerId) {
  return Object.entries(state?.items ?? {}).flatMap(([customerId, items]) => {
    const customer = customers.find((c) => c.id === customerId)
    return (items ?? []).map((item) => ({ item, customer, product: productById(item.productId) }))
      .filter((x) => x.customer && x.product?.partnerId === partnerId)
  })
}

/** Status of a ticket: the partner's own status, or derived from the customer's repair step. */
function ticketStatus(repair) {
  if (repair.partnerStatus) return repair.partnerStatus
  return repair.step >= 3 ? 'repaired' : repair.step === 2 ? 'scheduled' : 'new'
}

/** Open tickets (repair set) for this partner, newest customers' tickets first. */
export function partnerTickets(state, partnerId) {
  return itemsOfPartner(state, partnerId)
    .filter(({ item }) => item.repair && !item.returned)
    .map(({ item, customer, product }) => ({
      key: item.key,
      customerId: customer.id,
      firstName: customer.name,
      product: product.name,
      issue: item.repair.issue,
      note: item.repair.note ?? null,
      photo: item.repair.photo === true,
      preventive: item.repair.preventive === true,
      step: item.repair.step ?? 1,
      status: ticketStatus(item.repair),
      updatedOn: item.repair.updatedOn ?? null,
    }))
}

/** KPIs for the partner portal. */
export function partnerKpis(state, partnerId, tickets) {
  const mine = itemsOfPartner(state, partnerId)
  const pilot = partnerPilot[partnerId]
  const s = seed(partnerId)
  const inField = mine.filter(({ item }) => !item.returned).length
  const secondLife = mine.filter(({ item }) => item.returned).length
  return {
    open: tickets.filter((t) => t.status !== 'repaired').length,
    avgRepairDays: Math.round((1.4 + (s % 15) / 10) * 10) / 10,
    inField: (pilot?.activeContracts ?? 120 + (s % 400)) + inField,
    secondLife: 40 + (s % 160) + secondLife,
  }
}
