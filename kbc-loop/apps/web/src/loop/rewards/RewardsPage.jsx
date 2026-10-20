import { useState } from 'react'
import { num } from '@kbc-loop/shared/engine/format.js'
import { rewards, rewardById } from '@kbc-loop/shared/data/rewards.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { date } from '../product/format.js'
import { RewardIcon } from './RewardIcon.jsx'
import './rewards.css'

/** One reward row: icon, title, cost and a Redeem button (disabled without enough coins). */
function RewardRow({ reward, coins, onPick }) {
  const short = reward.cost > coins
  return (
    <li className={`rw-row ${reward.id === 'plant-tree' ? 'lp-eco-surface' : ''}`}>
      <span className="rw-icon"><RewardIcon reward={reward} /></span>
      <span className="rw-text">
        <b>{reward.title}</b>
        <small className="lp-num">{num(reward.cost)} coins{short ? ` · ${num(reward.cost - coins)} to go` : ''}</small>
      </span>
      <button type="button" className="lp-btn lp-sm" disabled={short} onClick={() => onPick(reward)}
        aria-label={`Redeem ${reward.title} for ${reward.cost} Kate Coins`}>
        Redeem
      </button>
    </li>
  )
}

/** Confirm step and success state, inline in a card above the list. */
function Confirm({ step, coins, onConfirm, onCancel, onDone }) {
  const { reward, done, busy } = step
  if (done) {
    return (
      <section className="lp-card rw-confirm" aria-live="polite">
        <span className="rw-ok"><LoopIcon name="check" size={20} /></span>
        <div className="rw-confirm-text">
          <b>Redeemed: {reward.title}</b>
          <small>You have {num(coins)} Kate Coins left.</small>
        </div>
        <button type="button" className="lp-btn lp-primary lp-sm" onClick={onDone} data-autofocus>Done</button>
      </section>
    )
  }
  return (
    <section className="lp-card rw-confirm" aria-live="polite">
      <span className="rw-icon"><RewardIcon reward={reward} /></span>
      <div className="rw-confirm-text">
        <b>Redeem {reward.title}?</b>
        <small className="lp-num">{num(reward.cost)} coins · {num(coins - reward.cost)} left after</small>
      </div>
      <div className="rw-confirm-actions">
        <button type="button" className="lp-btn lp-ghost lp-sm" onClick={onCancel}>Cancel</button>
        <button type="button" className="lp-btn lp-primary lp-sm" onClick={onConfirm} disabled={busy}>Confirm</button>
      </div>
    </section>
  )
}

/** Full page (own <main>) or embedded in the start-screen Rewards tab (no breadcrumb, no landmark). */
function Wrap({ embedded, children }) {
  return embedded ? <div className="rw rw-embedded">{children}</div> : <main className="lp-wrap lp-main rw">{children}</main>
}

/** Kate Coins rewards (#loop/rewards): balance, rewards to redeem and the redemption history. */
export function RewardsPage({ loop, actions, onBack, embedded = false }) {
  const { state, customer, coins = 0 } = loop
  const [step, setStep] = useState(null) // { reward, busy?, done? }
  const history = [...(state?.redemptions?.[customer?.id] ?? [])].reverse()

  const confirm = async () => {
    const { reward } = step
    setStep({ reward, busy: true })
    if (actions.redeemReward) await actions.redeemReward(reward.id)
    else await loop.dispatch({ type: 'REDEEM_REWARD', rewardId: reward.id })
    setStep({ reward, done: true })
  }

  return (
    <Wrap embedded={embedded}>
      {!embedded && (
        <nav className="pp-crumbs" aria-label="Breadcrumb">
          <ol>
            <li><button type="button" className="pp-crumb-back" onClick={onBack}><LoopIcon name="back" size={16} />Your home</button></li>
            <li aria-current="page">Rewards</li>
          </ol>
        </nav>
      )}

      <section className="rw-balance lp-card" aria-label="Balance">
        <span className="lp-eyebrow">Kate Coins</span>
        <b className="lp-num">{num(coins)}</b>
        <small>Earn coins with every repair and return.</small>
      </section>

      {step && (
        <Confirm step={step} coins={coins} onConfirm={confirm} onCancel={() => setStep(null)} onDone={() => setStep(null)} />
      )}

      <section aria-labelledby="rw-list-h">
        <h2 id="rw-list-h" className="rw-h">Rewards</h2>
        <ul className="rw-list lp-card">
          {rewards.map((r) => <RewardRow key={r.id} reward={r} coins={coins} onPick={(reward) => setStep({ reward })} />)}
        </ul>
      </section>

      <section aria-labelledby="rw-hist-h">
        <h2 id="rw-hist-h" className="rw-h">Redeemed</h2>
        {history.length ? (
          <ul className="rw-list lp-card">
            {history.map((h) => {
              const r = rewardById(h.rewardId)
              return (
                <li key={h.id} className="rw-row rw-past">
                  <span className="rw-icon"><RewardIcon reward={r} /></span>
                  <span className="rw-text"><b>{r?.title ?? 'Reward'}</b><small>{date(h.on)}</small></span>
                  <small className="lp-num rw-cost">− {num(r?.cost ?? 0)}</small>
                </li>
              )
            })}
          </ul>
        ) : <p className="rw-empty">Nothing redeemed yet.</p>}
      </section>
    </Wrap>
  )
}
