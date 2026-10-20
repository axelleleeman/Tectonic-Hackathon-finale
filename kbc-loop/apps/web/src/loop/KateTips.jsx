import { productById } from '@kbc-loop/shared/engine/catalog.js'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from './LoopIcon.jsx'

const SOURCE = { transacties: 'Based on your transactions', toestel: 'Reported by your device' }

/**
 * Kate tips = the shared signals (engine/signals.js) for the current customer.
 * Offer → opens the add dialog (BORROW); device wear → free preventive replacement (REPORT_DEFECT, preventive);
 * "Not interested" → DISMISS_SIGNAL. All changes are shared live with the app.
 */
export function KateTips({ signals, onOffer, onPreventive, onDismiss }) {
  return (
    <section className="lp-section" aria-labelledby="lp-tips-title">
      <h2 className="lp-h2" id="lp-tips-title">Tips from Kate</h2>
      {signals.length === 0 ? (
        <div className="lp-card lp-empty">
          <p>No tips right now.</p>
        </div>
      ) : (
        <div className="lp-tips">
          {signals.map((s) => {
            const product = s.productId ? productById(s.productId) : null
            return (
              <article key={s.id} className="lp-card lp-tip">
                <div className="lp-tip-head">
                  <span className="lp-kate" aria-hidden="true">K</span>
                  <h3>{s.headline}</h3>
                </div>
                <details className="lp-why">
                  <summary>Why?</summary>
                  <ul>
                    <li>{SOURCE[s.source] ?? 'Tip from Kate'}</li>
                    {s.reasons.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                </details>
                <div className="lp-tip-actions">
                  {product && (
                    <button type="button" className="lp-btn lp-primary lp-sm" onClick={() => onOffer(product.id)}>
                      View · {euro(product.monthly)}/mo
                    </button>
                  )}
                  {s.itemKey && (
                    <button type="button" className="lp-btn lp-primary lp-sm" onClick={() => onPreventive(s.itemKey)}>
                      <LoopIcon name="wrench" size={16} />Free replacement
                    </button>
                  )}
                  <button type="button" className="lp-btn lp-sm lp-ghost" onClick={() => onDismiss(s.id)} aria-label="Not interested, dismiss tip">Dismiss</button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
