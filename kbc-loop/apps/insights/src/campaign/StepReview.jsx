import { euro } from '@kbc-loop/shared/engine/format.js'
import { campaignForecast } from '@kbc-loop/shared/engine/campaigns.js'
import { Icon } from '../components/Icon.jsx'
import { AUDIENCE_LABEL, groupMeta } from '../model.js'
import { ForecastStrip } from './ForecastStrip.jsx'

/** Step 4: everything in one summary, each part editable, plus the expected result. */
export function StepReview({ segment, draft, onEdit }) {
  const rows = [
    { k: 'Group', v: <>{segment.label}<small>{groupMeta(segment)}</small></>, editStep: 1 },
    { k: 'Offer', v: <>{segment.product.name} from {segment.partner}<small>{euro(segment.product.monthly)} / month</small></> },
    { k: 'Channel', v: 'Kate in KBC Mobile' },
    { k: 'Message', v: <span className="ins-quote-inline">{draft.message}</span>, editStep: 2 },
    { k: 'Audience', v: AUDIENCE_LABEL[draft.audience], editStep: 3 },
    { k: 'Budget', v: euro(draft.budget), editStep: 3 },
  ]
  return (
    <div className="ins-stack">
      <section className="ins-card" aria-label="Campaign summary">
        <dl className="ins-review">
          {rows.map(({ k, v, editStep }) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
              {editStep && <button type="button" className="ins-btn ins-btn-sm ins-ghost" onClick={() => onEdit(editStep)} aria-label={`Edit ${k.toLowerCase()}`}><Icon name="pencil" size={14} />Edit</button>}
            </div>
          ))}
        </dl>
      </section>
      <ForecastStrip forecast={campaignForecast(segment, draft)} />
    </div>
  )
}
