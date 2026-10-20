/** Bedrag in KBC Mobile-stijl: "789,45 EUR" met kleinere decimalen. */
export function Amount({ value, className = '' }) {
  const [int, dec] = Math.abs(value).toLocaleString('nl-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',')
  return (
    <span className={`amount ${value < 0 ? 'neg' : ''} ${className}`}>
      {value < 0 ? '-' : ''}{int}<small>,{dec}</small> <em>EUR</em>
    </span>
  )
}
