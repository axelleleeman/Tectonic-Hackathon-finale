/** Bedrag zoals in KBC Mobile: "2 483,17 EUR" met kleinere decimalen. */
export function Amount({ value, unit = 'EUR', className = '' }) {
  const [int, dec] = Math.abs(value).toFixed(2).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return (
    <span className={`amount ${className}`}>
      {value < 0 ? '-' : ''}{grouped}<small>,{dec}</small> <em>{unit}</em>
    </span>
  )
}
