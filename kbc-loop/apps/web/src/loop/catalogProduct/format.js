/** 60 → "5 years", 18 → "18 months". */
export function termLabel(months) {
  if (months % 12 === 0) return `${months / 12} year${months === 12 ? '' : 's'}`
  return `${months} months`
}

/** 1250 → "1.3 t", 340 → "340 kg". */
export const co2Label = (kg) => (kg >= 1000 ? `${(kg / 1000).toFixed(1)} t` : `${Math.round(kg)} kg`)
