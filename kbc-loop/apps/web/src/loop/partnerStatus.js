// Customer-facing wording for the status a partner sets on a repair (PARTNER_UPDATE_REPAIR), shared by the
// product page (RepairTracker) and the partner portal. Tolerant of state without a partner status.
export const PARTNER_STATUSES = ['scheduled', 'on-the-way', 'in-progress', 'repaired']

const LINES = {
  scheduled: 'Technician visit scheduled',
  'on-the-way': 'Technician on the way',
  'in-progress': 'Repair in progress',
  repaired: 'Repaired by the partner',
}

/** Friendly line for repair.partnerStatus, or null when the partner has not updated the repair yet. */
export const partnerStatusLine = (status) => LINES[status] ?? null

/** "20 Oct, 14:05" for a timestamp, "20 Oct" for a plain date, '' when missing or invalid. */
export function updatedLabel(value) {
  if (!value) return ''
  const plainDate = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  const d = new Date(plainDate ? `${value}T12:00:00` : value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', ...(plainDate ? {} : { hour: '2-digit', minute: '2-digit' }) })
}
