import { money, percent } from '../product/format.js'

const SPLIT_PARTS = [
  { key: 'partner', label: 'Partner', text: 'The device, delivery, maintenance and repairs' },
  { key: 'insurance', label: 'KBC Insurance', text: 'Cover for damage and theft' },
  { key: 'kbc', label: 'KBC', text: 'Financing, payments and your single point of contact' },
]

/**
 * Stacked bar of where a monthly fee goes (partner / insurance / KBC), with the amounts and shares as text
 * in the legend so nothing depends on colour alone.
 */
export function FeeSplit({ split, caption = 'per month', showText = false }) {
  const total = SPLIT_PARTS.reduce((s, p) => s + (split?.[p.key] ?? 0), 0)
  if (!total) return null
  return (
    <div className="fs">
      <div className="fs-bar" role="img" aria-label={SPLIT_PARTS.map((p) => `${p.label} ${money(split[p.key])}`).join(', ')}>
        {SPLIT_PARTS.map((p) => (split[p.key] > 0
          ? <span key={p.key} className={`fs-seg fs-${p.key}`} style={{ flexGrow: split[p.key] }} />
          : null))}
      </div>
      <ul className="fs-legend">
        {SPLIT_PARTS.map((p) => (
          <li key={p.key}>
            <span className={`fs-key fs-${p.key}`} aria-hidden="true" />
            <span className="lp-min0">
              <b>{p.label}</b>
              {showText && <small>{p.text}</small>}
            </span>
            <span className="fs-val lp-num">{money(split[p.key])}<small>{percent(split[p.key] / total)}</small></span>
          </li>
        ))}
      </ul>
      <p className="fs-total lp-num">Total {money(total)} {caption}</p>
    </div>
  )
}
