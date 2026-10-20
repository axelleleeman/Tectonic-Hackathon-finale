// Zonder `digits`: hele bedragen zonder decimalen, andere met 2 (€ 15 maar € 19,90).
export function euro(n, digits = Number.isInteger(n) ? 0 : 2) {
  return n.toLocaleString('nl-BE', { style: 'currency', currency: 'EUR', minimumFractionDigits: digits, maximumFractionDigits: digits })
}

export function num(n, digits = 0) {
  return n.toLocaleString('nl-BE', { maximumFractionDigits: digits })
}

export function formatDate(iso, { withYear = false } = {}) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}) })
}
