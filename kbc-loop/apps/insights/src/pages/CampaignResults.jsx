import { useState } from 'react'
import { euro, formatDate, num } from '@kbc-loop/shared/engine/format.js'
import { campaignResults } from '@kbc-loop/shared/engine/campaigns.js'
import { PageHead } from '../components/PageHead.jsx'
import { StatusPill } from '../components/StatusPill.jsx'
import { Segmented } from '../components/Segmented.jsx'
import { Icon } from '../components/Icon.jsx'
import { ResultsHero, ResultsPanel } from '../campaign/ResultsPanel.jsx'
import { StopCampaign } from '../campaign/StopCampaign.jsx'
import { LiveIndicator } from '../components/LiveIndicator.jsx'
import { campaignCsvRows, csvFileName, downloadCsv } from '../campaign/exportCsv.js'
import { AUDIENCE_LABEL, SIM_DAYS, resolveDetail, simDate } from '../model.js'
import { href } from '../useRoute.js'

/** Step 5: live results of one campaign (simulated from the group's figures and the days since start). */
export function CampaignResults({ state, actions, segments, segmentId, status }) {
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
  const asOf = simDate(offset)
  const r = campaignResults(s, d, asOf)
  const exportCsv = () => downloadCsv(csvFileName(s.id, asOf), campaignCsvRows({ segment: s, detail: d, results: r, asOf }))

  return (
    <>
      <PageHead eyebrow={<StatusPill status={d.status} />} title={s.label} back={{ href: href.campaigns, label: 'All campaigns' }}
        below={(
          <>
            <div className="ins-toolbar">
              <div className="ins-row">
                {d.status === 'running' ? <LiveIndicator status={status} /> : <span className="ins-eyebrow">Final results</span>}
                <span className="ins-eyebrow">Day {num(r.day)} · simulated</span>
              </div>
              <div className="ins-row">
                {d.status === 'running' && <Segmented label="Show results as of" name="sim" value={offset} options={SIM_DAYS} onChange={setOffset} />}
                <button type="button" className="ins-btn ins-btn-sm" onClick={exportCsv}><Icon name="download" size={16} />Export CSV</button>
              </div>
            </div>
            <ResultsHero results={r} segment={s} />
          </>
        )}>
        {AUDIENCE_LABEL[d.audience]} · {euro(d.budget)} · since {formatDate(d.startedOn)}
      </PageHead>

      {d.status === 'running' && (
        <p className="ins-visible">
          <span className="ins-visible-badge"><Icon name="phone" size={16} />Visible in the customer app</span>
          <span>Matching customers see this message as a tip from Kate in KBC Mobile while the campaign runs.</span>
        </p>
      )}

      <ResultsPanel results={r} product={s.product} message={d.message} />

      {d.status === 'running' && <StopCampaign label={s.label} onStop={() => actions.stopCampaign(s.id)} />}
      {d.status === 'stopped' && (
        <p className="ins-center"><a className="ins-btn ins-primary" href={href.newCampaign(s.id)}>New campaign</a></p>
      )}
    </>
  )
}
