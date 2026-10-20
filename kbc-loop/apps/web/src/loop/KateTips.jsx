import { useMemo, useState } from 'react'
import { productById } from '@kbc-loop/shared/engine/catalog.js'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { KATE_LEVELS, kateLevelOf } from '@kbc-loop/shared/data/dataChoices.js'
import { conditionVisual, tipVisual } from '@kbc-loop/shared/kate/tipVisual.js'
import { LoopIcon } from './LoopIcon.jsx'
import { TipFlow } from './kate/TipFlow.jsx'
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
      visual: conditionVisual({ id: `care-${worn.item.key}`, condition: worn.condition, months: worn.months,
        line: 'Maintenance and repairs are included. Ask for a check-up.', price: `${euro(worn.product.monthly)} / month` }),
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
      visual: {
        series: null,
        insight: `Same partner: ${up.partner.short}`,
        line: `${up.upgrade.name}, a newer model in the same range.`,
        price: `${euro(up.upgrade.monthly)} / month`,
        summary: `Insight: a newer model from ${up.partner.short}. Kate suggests: ${up.upgrade.name}.`,
      },
    })
  }
  return tips.slice(0, MAX_EXTRA)
}

/** "Kate level: Proactive ›" — opens the data choices (#loop/consent). */
function LevelChip({ level, onLevel }) {
  const label = KATE_LEVELS.find((l) => l.id === level)?.label
  if (!onLevel) return <span className="lp-kate-level">Kate level: {label}</span>
  return (
    <button type="button" className="lp-kate-level" onClick={onLevel} aria-label={`Kate level: ${label}. Change your data choices`}>
      Kate level: {label}<LoopIcon name="arrow" size={14} />
    </button>
  )
}

/**
 * Tips from Kate = the shared signals (engine/signals.js) for the current customer, plus up to two tips derived from
 * the customer's products when there is little else to say. Each tip is drawn as pattern → insight → Kate
 * (kate/TipFlow.jsx, data from @kbc-loop/shared/kate/tipVisual.js). Offer → add dialog (BORROW); device wear → free
 * preventive replacement (REPORT_DEFECT, preventive); Dismiss → DISMISS_SIGNAL (derived tips are hidden locally).
 * On the Basic Kate level there are no tips, only Kate's calm line.
 */
export function KateTips({ customer, signals, rows = [], kateLevel, onLevel, onOffer, onPreventive, onDismiss, onOpen }) {
  const [hidden, setHidden] = useState(() => new Set())
  const level = kateLevelOf(kateLevel)
  const basic = level === 'basic'
  const list = basic ? [] : signals
  const extra = useMemo(() => (!basic && list.length <= 1 ? productTips(rows) : []), [basic, list.length, rows])
  const shownExtra = extra.filter((t) => !hidden.has(t.id))
  const count = list.length + shownExtra.length

  return (
    <section className="lp-section lp-tips-sec" aria-labelledby="lp-tips-title">
      <div className="lp-sec-row">
        <span className="lp-kate lp-kate-lg" aria-hidden="true">K</span>
        <h2 className="lp-h2" id="lp-tips-title">Tips from Kate</h2>
        {count > 0 && <span className="lp-count lp-num" aria-label={`${count} tips`}>{count}</span>}
        <LevelChip level={level} onLevel={onLevel} />
      </div>
      {basic ? (
        <div className="lp-card lp-empty"><p>{KATE_LEVELS[0].line}</p></div>
      ) : count === 0 ? (
        <div className="lp-card lp-empty"><p>No tips right now. Kate lets you know when something can save you money.</p></div>
      ) : (
        <div className="tf-list">
          {list.map((s) => {
            const product = s.productId ? productById(s.productId) : null
            return (
              <TipFlow key={s.id} visual={tipVisual(s, customer)} title={s.headline}
                reasons={[SOURCE[s.source] ?? 'Tip from Kate', ...(s.reasons ?? [])]} onDismiss={() => onDismiss(s.id)}
                actions={<>
                  {product && (
                    <button type="button" className="tf-btn" onClick={() => onOffer(product.id)}>View offer</button>
                  )}
                  {s.itemKey && (
                    <button type="button" className="tf-btn" onClick={() => onPreventive(s.itemKey)}>
                      <LoopIcon name="wrench" size={16} />Free replacement
                    </button>
                  )}
                </>} />
            )
          })}
          {shownExtra.map((t) => (
            <TipFlow key={t.id} visual={t.visual} title={t.headline} reasons={t.reasons}
              onDismiss={() => setHidden((h) => new Set(h).add(t.id))}
              actions={
                <button type="button" className="tf-btn"
                  onClick={() => (t.cta.productId ? onOffer(t.cta.productId) : onOpen?.(t.cta.itemKey))}>
                  {t.cta.label}
                </button>
              } />
          ))}
        </div>
      )}
    </section>
  )
}
