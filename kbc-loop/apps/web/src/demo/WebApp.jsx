import { useLoop } from '@kbc-loop/web-ui/useLoop.js'
import { useHashRoute } from '../hooks/useHashRoute.js'
import { LoopPage } from '../loop/LoopPage.jsx'
import { useTheme } from '../loop/useTheme.js'
import { PartnerPortal } from './dashboards/PartnerDashboard.jsx'
import { KbcAppsTop, KbcAppsGrid } from './site/KbcAppsPage.jsx'

// Web view: thin router between the KBC "All apps" page (pixel-exact screenshot with a clickable
// KBC Loop tab and card) and the KBC LOOP page. Web, app and dashboards share one api and database.
export default function WebApp() {
  const { route, param, go } = useHashRoute()
  const loop = useLoop()
  const { theme, toggle } = useTheme()

  if (route === 'partner') return <PartnerPortal loop={loop} theme={theme} onToggleTheme={toggle} onBack={() => go(null)} />
  if (route) return <LoopPage route={route} param={param} go={go} loop={loop} />

  return (
    <div className="site">
      <KbcAppsTop onLoop={false} onOverview={() => go(null)} onOpenLoop={() => go('home')} />
      <KbcAppsGrid onOpenLoop={() => go('home')} />
      <p className="fine site-disclaimer">Concept prototype for the Tectonic Hackathon, not an official KBC website or app.</p>
    </div>
  )
}
