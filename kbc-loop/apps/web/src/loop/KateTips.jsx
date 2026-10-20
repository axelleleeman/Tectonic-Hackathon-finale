import { useMemo, useState } from 'react'
import { productById } from '@kbc-loop/shared/engine/catalog.js'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from './LoopIcon.jsx'
import { hasOpenRepair } from './model.js'

const SOURCE = { transacties: 'Based on your transactions', toestel: 'Reported by your device' }
const MAX_EXTRA = 2

/**
 * Extra tips derived from the customer's own products, only shown when Kate has at most one live signal.
 * Each tip needs real data behind it: an upgrade from the same partner, or a product whose estimated condition dropped.
 */
function productTips(rows) {
  const active = rows.filter((r) => !r.item.returned && !hasOpenRepair(r))
  const tips = []
  const worn = [...active].sort((a, b) => a.condition - b.condition).find((r) => r.condition < 85)
  if (worn) {
    tips.push({
      id: `care-${worn.item.key}`,
      headline: `Keep your ${worn.product.name} in shape`,
      line: `Estimated condition ${worn.condition}%. Maintenance and repairs are included.`,
      reasons: [`In use for ${worn.months} months`, 'Condition is estimated from age and past repairs'],
      cta: { label: 'View product', itemKey: worn.item.key },
    })
  }
  const up = active.find((r) => r.upgrade && r.item.key !== worn?.item.key) ?? active.find((r) => r.upgrade)
  if (up) {
    tips.push({
      id: `upgrade-${up.item.key}`,
      headline: `Upgrade available for your ${up.product.name}`,
      line: `${up.upgrade.name} from ${up.partner.short}, ${euro(up.upgrade.monthly)}/mo.`,
      reasons: [`Same partner: ${up.partner.short}`, 'A newer model in the same range'],
      cta: { label: 'View upgrade', productId: up.upgrade.id },
    })
  }
  return tips.slice(0, MAX_EXTRA)
}

function TipCard({ headline, line, reasons, children, onDismiss }) {
  return (
    <article className="lp-card lp-tip">
      <h3>{headline}</h3>
      {line && <p className="lp-tip-line">{line}</p>}
      <details className="lp-why">
        <summary>Why?</summary>
        <ul>{reasons.map((r) => <li key={r}>{r}</li>)}</ul>
      </details>
      <div className="lp-tip-actions">
        {children}
        <button type="button" className="lp-btn lp-sm lp-ghost" onClick={onDismiss} aria-label={`Dismiss tip: ${headline}`}>Dismiss</button>
      </div>
    </article>
  )
}

/**
 * Tips from Kate = the shared signals (engine/signals.js) for the current customer, plus up to two tips derived from
 * the customer's products when there is little else to say. Offer → add dialog (BORROW); device wear → free
 * preventive replacement (REPORT_DEFECT, preventive); Dismiss → DISMISS_SIGNAL (derived tips are hidden locally).
 */
export function KateTips({ signals, rows = [], onOffer, onPreventive, onDismiss, onOpen }) {
  const [hidden, setHidden] = useState(() => new Set())
  const extra = useMemo(() => (signals.length <= 1 ? productTips(rows) : []), [signals.length, rows])
  const shownExtra = extra.filter((t) => !hidden.has(t.id))
  const count = signals.length + shownExtra.length

  return (
    <section className="lp-section lp-tips-sec" aria-labelledby="lp-tips-title">
      <div className="lp-sec-row">
        <span className="lp-kate lp-kate-lg" aria-hidden="true">K</span>
        <h2 className="lp-h2" id="lp-tips-title">Tips from Kate</h2>
        {count > 0 && <span className="lp-count lp-num" aria-label={`${count} tips`}>{count}</span>}
      </div>
      {count === 0 ? (
        <div className="lp-card lp-empty"><p>No tips right now. Kate lets you know when something can save you money.</p></div>
      ) : (
        <div className="lp-tips">
          {signals.map((s) => {
            const product = s.productId ? productById(s.productId) : null
            return (
              <TipCard key={s.id} headline={s.headline} line={s.reasons?.[0] ?? null}
                reasons={[SOURCE[s.source] ?? 'Tip from Kate', ...(s.reasons ?? []).slice(1)]} onDismiss={() => onDismiss(s.id)}>
                {product && (
                  <button type="button" className="lp-btn lp-primary lp-sm" onClick={() => onOffer(product.id)}>
                    <span className="lp-num">View · {euro(product.monthly)}/mo</span>
                  </button>
                )}
                {s.itemKey && (
                  <button type="button" className="lp-btn lp-primary lp-sm" onClick={() => onPreventive(s.itemKey)}>
                    <LoopIcon name="wrench" size={16} />Free replacement
                  </button>
                )}
              </TipCard>
            )
          })}
          {shownExtra.map((t) => (
            <TipCard key={t.id} headline={t.headline} line={t.line} reasons={t.reasons}
              onDismiss={() => setHidden((h) => new Set(h).add(t.id))}>
              <button type="button" className="lp-btn lp-sm"
                onClick={() => (t.cta.productId ? onOffer(t.cta.productId) : onOpen?.(t.cta.itemKey))}>
                {t.cta.label}<LoopIcon name="arrow" size={16} />
              </button>
            </TipCard>
          ))}
        </div>
      )}
    </section>
  )
}
