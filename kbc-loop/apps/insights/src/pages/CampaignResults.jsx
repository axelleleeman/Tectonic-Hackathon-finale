import { useState } from 'react'
import { euro, formatDate } from '@kbc-loop/shared/engine/format.js'
import { campaignResults } from '@kbc-loop/shared/engine/campaigns.js'
import { PageHead } from '../components/PageHead.jsx'
import { StatusPill } from '../components/StatusPill.jsx'
import { Segmented } from '../components/Segmented.jsx'
import { Icon } from '../components/Icon.jsx'
import { ResultsPanel } from '../campaign/ResultsPanel.jsx'
import { StopCampaign } from '../campaign/StopCampaign.jsx'
import { AUDIENCE_LABEL, SIM_DAYS, resolveDetail, simDate } from '../model.js'
import { href } from '../useRoute.js'

/** Step 5: live results of one campaign (simulated from the group's figures and the days since start). */
export function CampaignResults({ state, actions, segments, segmentId }) {
  const [offset, setOffset] = useState(0)
  const s = segments.find((x) => x.id === segmentId)
  const running = (state.campaigns ?? []).includes(segmentId)
  const stored = state.campaignDetails?.[segmentId]

  if (!s || (!running && !stored)) {
    return (
      <>
        <PageHead eyebrow="Campaigns" title="Campaign not found">This group has no campaign (yet).</PageHead>
        <a className="ins-btn" href={href.campaigns}><Icon name="back" />All campaigns</a>
      </>
    )
  }
  const d = resolveDetail(s, stored, running)
  const r = campaignResults(s, d, simDate(offset))

  return (
    <>
      <a className="ins-backlink" href={href.campaigns}><Icon name="back" size={16} />All campaigns</a>
      <PageHead eyebrow={<StatusPill status={d.status} />} title={s.label}>
        {AUDIENCE_LABEL[d.audience]} · {euro(d.budget)} · since {formatDate(d.startedOn)}
      </PageHead>

      <div className="ins-toolbar">
        <p className="ins-eyebrow">Day {r.day} · simulated</p>
        {d.status === 'running' && <Segmented label="Show results as of" name="sim" value={offset} options={SIM_DAYS} onChange={setOffset} />}
      </div>

      <ResultsPanel results={r} product={s.product} message={d.message} />

      {d.status === 'running' && <StopCampaign label={s.label} onStop={() => actions.stopCampaign(s.id)} />}
      {d.status === 'stopped' && (
        <p className="ins-center"><a className="ins-btn ins-primary" href={href.newCampaign(s.id)}>New campaign</a></p>
      )}
    </>
  )
}
