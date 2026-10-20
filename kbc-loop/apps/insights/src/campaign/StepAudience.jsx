import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { AUDIENCES, COST_PER_CUSTOMER, audienceSize, budgetRange, campaignForecast } from '@kbc-loop/shared/engine/campaigns.js'
import { AUDIENCE_LABEL } from '../model.js'
import { ForecastStrip } from './ForecastStrip.jsx'

const AUDIENCE_HELP = {
  consented: 'Largest reach',
  'consented-active': 'Best response',
}

/** Step 3: audience (always consented) and budget slider, with a live forecast. */
export function StepAudience({ segment, draft, onChange }) {
  const range = budgetRange(segment)
  const f = campaignForecast(segment, draft)
  return (
    <div className="ins-stack">
      <div className="ins-card ins-pad"><fieldset className="ins-radio-cards">
        <legend className="ins-label">Audience</legend>
        {AUDIENCES.map((a) => (
          <label key={a} className={draft.audience === a ? 'on' : ''}>
            <input type="radio" name="audience" value={a} checked={draft.audience === a} onChange={() => onChange({ audience: a })} />
            <span><b>{AUDIENCE_LABEL[a]}</b><small>{AUDIENCE_HELP[a]}</small></span>
            <span className="ins-num ins-radio-n">{num(audienceSize(segment, a))}<small>customers</small></span>
          </label>
        ))}
      </fieldset></div>

      <div className="ins-card ins-pad">
        <div className="ins-row ins-between">
          <label htmlFor="budget" className="ins-label">Budget</label>
          <output htmlFor="budget" className="ins-budget ins-num">{euro(draft.budget)}</output>
        </div>
        <input id="budget" type="range" className="ins-range" min={range.min} max={range.max} step={range.step} value={Math.min(draft.budget, range.max)}
          aria-valuetext={euro(draft.budget)} aria-describedby="budget-help" onChange={(e) => onChange({ budget: Number(e.target.value) })} />
        <div className="ins-row ins-between ins-small ins-muted" aria-hidden="true"><span>{euro(range.min)}</span><span>{euro(range.max)}</span></div>
        <p id="budget-help" className="ins-small ins-muted">
          Reaches <b className="ins-ink">{num(f.target)}</b> of {num(f.audience)} · {euro(COST_PER_CUSTOMER, 2)} per customer
        </p>
      </div>

      <ForecastStrip forecast={f} />
    </div>
  )
}
