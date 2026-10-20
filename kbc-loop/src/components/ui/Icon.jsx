import { icons } from './icons.js'

export function Icon({ name, size = 22, className }) {
  if (!icons[name]) return null // onbekend icoon: niets tonen i.p.v. de app te laten crashen
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name].map((d) => <path key={d} d={d} />)}
    </svg>
  )
}
