// KBC Loop Insights: internal tool for KBC marketing. Anonymised spending groups → a Kate campaign.
// Group figures come from the api (GET /api/insights); campaigns live in the shared state (database),
// so a started campaign also shows up in the KBC dashboard of the web presentation.
import { useEffect, useMemo } from 'react'
import { useLoop } from '@kbc-loop/web-ui/useLoop.js'
import { useTheme } from '@kbc-loop/web-ui/useTheme.js'
import { MIN_GROUP_SIZE } from '@kbc-loop/shared/config/index.js'
import { bindActions } from '@kbc-loop/shared/state/actions.js'
import { AppHeader } from './components/AppHeader.jsx'
import { Loading } from './components/Loading.jsx'
import { ErrorBanner } from './components/ErrorBanner.jsx'
import { useRoute } from './useRoute.js'
import { ALL, useInsights } from './useInsights.js'
import { Overview } from './pages/Overview.jsx'
import { Groups } from './pages/Groups.jsx'
import { Campaigns } from './pages/Campaigns.jsx'
import { CampaignResults } from './pages/CampaignResults.jsx'
import { Wizard } from './campaign/Wizard.jsx'

export default function InsightsApp() {
  const { theme, toggle } = useTheme('kbc-loop-insights-theme')
  const { state, dispatch, error, status } = useLoop()
  const actions = useMemo(() => bindActions(dispatch), [dispatch])
  const { data, error: loadError } = useInsights(ALL)
  const route = useRoute()

  useEffect(() => {
    document.documentElement.style.colorScheme = theme
    document.documentElement.dataset.theme = theme
  }, [theme])
  useEffect(() => { window.scrollTo(0, 0) }, [route.page, route.id])

  const ready = state && data
  const page = route.page === 'campaigns' && route.id ? (route.id === 'new' ? 'wizard' : 'results') : route.page
  const ctx = ready ? { state, actions, segments: data.segments, data, go: route.go, status } : null

  return (
    <div className="ins loop-theme" data-theme={theme}>
      <a className="ins-skip" href="#main">Skip to content</a>
      <AppHeader page={route.page} theme={theme} onToggleTheme={toggle} runningCount={state?.campaigns?.length ?? 0} status={status} />
      <main id="main" className="ins-wrap ins-main">
        {!ready && <Loading error={error ?? loadError} />}
        {ready && (error || status === 'offline') && (
          <ErrorBanner title="Connection to the KBC Loop server lost">
            {error ? `${error}. ` : ''}Figures may be out of date; the dashboard reconnects automatically.
          </ErrorBanner>
        )}
        {ready && page === 'groups' && <Groups {...ctx} />}
        {ready && page === 'campaigns' && <Campaigns {...ctx} />}
        {ready && page === 'wizard' && <Wizard key={route.params.get('group') ?? 'new'} {...ctx} initialGroup={route.params.get('group')} />}
        {ready && page === 'results' && <CampaignResults {...ctx} segmentId={route.id} />}
        {ready && !['groups', 'campaigns', 'wizard', 'results'].includes(page) && <Overview {...ctx} />}
      </main>
      <footer className="ins-wrap ins-foot">
        <p>
          <b>Data source:</b> aggregated, anonymised spending patterns from the KBC Loop api (<code>GET /api/insights</code>).
          Groups under {MIN_GROUP_SIZE} customers are hidden and only customers who gave consent can be reached.
        </p>
        <p>Prototype · fictional data · campaign results are simulated from each group&apos;s figures.</p>
      </footer>
    </div>
  )
}
