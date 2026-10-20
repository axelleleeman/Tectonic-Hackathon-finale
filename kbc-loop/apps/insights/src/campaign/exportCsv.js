// Client-side CSV export of a campaign's settings and funnel (RFC 4180, UTF-8 with BOM so Excel reads € and accents).

/**
 * One CSV field: quoted when it holds a comma, quote or line break; inner quotes doubled.
 * Text that starts with = + - @ (or a tab / carriage return) gets a leading apostrophe so
 * spreadsheet apps do not run it as a formula (CSV injection). Numbers are written as is.
 */
export function csvField(value) {
  if (value == null) return ''
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : ''
  let s = String(value)
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export const toCsv = (rows) => rows.map((r) => r.map(csvField).join(',')).join('\r\n')

/** Rows for one campaign: settings first, then the funnel and outcome as of the shown day. */
export function campaignCsvRows({ segment, detail, results: r, asOf }) {
  return [
    ['Section', 'Metric', 'Value', 'Unit'],
    ['Settings', 'Group', segment.label, ''],
    ['Settings', 'Group id', segment.id, ''],
    ['Settings', 'Status', detail.status, ''],
    ['Settings', 'Channel', 'Kate in KBC Mobile', ''],
    ['Settings', 'Audience', detail.audience, ''],
    ['Settings', 'Budget', detail.budget, 'EUR'],
    ['Settings', 'Started on', detail.startedOn, 'date'],
    ['Settings', 'Results as of', asOf, 'date'],
    ['Settings', 'Day', r.day, 'days'],
    ['Settings', 'Offer', `${segment.product.name} from ${segment.partner}`, ''],
    ['Settings', 'Offer price', segment.product.monthly, 'EUR / month'],
    ['Settings', 'Message', detail.message, ''],
    ['Funnel', 'Target', r.target, 'customers'],
    ['Funnel', 'Reached', r.reached, 'customers'],
    ['Funnel', 'Opened', r.opened, 'customers'],
    ['Funnel', 'Clicked through', r.clicked, 'customers'],
    ['Funnel', 'Signed a contract', r.contracts, 'customers'],
    ['Rates', 'Reached of target', r.reachedPct, '%'],
    ['Rates', 'Open rate', r.openRate, '%'],
    ['Rates', 'Click rate', r.clickRate, '%'],
    ['Outcome', 'Budget spent', r.spent, 'EUR'],
    ['Outcome', 'Rent per month', round2(r.monthlyRevenue), 'EUR / month'],
    ['Outcome', 'KBC margin per month', round2(r.kbcMarginMonthly), 'EUR / month'],
    ['Outcome', 'CO2 avoided', round2(r.co2Tons), 't'],
    ['Forecast', 'Contracts at end', r.forecast?.contracts, 'customers'],
  ]
}

const round2 = (n) => (typeof n === 'number' ? Math.round(n * 100) / 100 : n)

/** Download text as a file without a server round trip. */
export function downloadCsv(filename, rows) {
  const blob = new Blob([`\uFEFF${toCsv(rows)}\r\n`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

/** Safe file name: lowercase letters, digits and dashes only. */
export const csvFileName = (id, date) => `kbc-loop-campaign-${String(id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${date}.csv`
