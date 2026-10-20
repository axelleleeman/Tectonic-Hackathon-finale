import { useRef } from 'react'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { useLoopScene } from './three/LoopScene.js'
import { greeting } from './model.js'

// Hero with the 3D loop and the linear ↔ circular comparison.
export function Hero({ customer, rows, circular, onMode, theme }) {
  const canvasRef = useRef(null)
  useLoopScene(canvasRef, circular, theme)

  const buyCost = rows.reduce((s, r) => s + r.product.buyPrice + r.product.expectedRepairs, 0)
  const linearText = rows.length
    ? `Without LOOP you would have bought these ${rows.length} ${rows.length === 1 ? 'device' : 'devices'} yourself: ${euro(buyCost)} in purchases and repairs, and in the end they would all be thrown away.`
    : 'Without LOOP you buy every device yourself, pay for every repair and throw it away at the end.'

  return (
    <section className="lp-hero" aria-labelledby="lp-hero-title">
      <canvas ref={canvasRef} className="lp-gl" aria-hidden="true" />
      <div className="lp-wrap">
        <div className="lp-copy">
          <div className="lp-eyebrow">{greeting()}, {customer.name}</div>
          {circular ? (
            <h1 id="lp-hero-title">Stop buying.<br /><span className="lp-accent">Start looping.</span></h1>
          ) : (
            <h1 id="lp-hero-title">Buy. Break.<br /><span className="lp-muted">Throw away.</span></h1>
          )}
          <p aria-live="polite">{circular ? 'Pay for what you use. Repairs, upgrades and recycling are taken care of.' : linearText}</p>
          <div className="lp-segrow">
            <div className="lp-seg" role="group" aria-label="Compare the two models">
              <button type="button" aria-pressed={!circular} onClick={() => onMode(false)}>Linear</button>
              <button type="button" aria-pressed={circular} onClick={() => onMode(true)}>Circular</button>
            </div>
            <span className="lp-seglabel">Compare the two models</span>
          </div>
        </div>
      </div>
    </section>
  )
}
