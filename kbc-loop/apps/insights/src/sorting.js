// Table sorting helpers (no React).

/** Next sort state: same column flips direction, a new column starts high-to-low (numbers) or A-Z (text). */
export const nextSort = (current, key, numeric) => (current.key === key
  ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' }
  : { key, dir: numeric ? 'desc' : 'asc' })

/** Sort rows by a column definition [key, header, getter, numeric]. */
export function sortRows(rows, columns, sort) {
  const col = columns.find(([k]) => k === sort.key)
  if (!col) return rows
  const [, , get, numeric] = col
  const sign = sort.dir === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => sign * (numeric ? get(a) - get(b) : String(get(a)).localeCompare(String(get(b)), 'en')))
}
