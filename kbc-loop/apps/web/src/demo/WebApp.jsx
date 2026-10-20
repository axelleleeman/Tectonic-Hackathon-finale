import { useLoop } from '@kbc-loop/web-ui/useLoop.js'
import { useHashRoute } from '../hooks/useHashRoute.js'
import { LoopPage } from '../loop/LoopPage.jsx'
import { KbcAppsTop, KbcAppsGrid } from './site/KbcAppsPage.jsx'

// Web view: thin router between the KBC "All apps" page (pixel-exact screenshot with a clickable
// KBC Loop tab and card) and the KBC LOOP page. Web, app and dashboards share one api and database.
export default function WebApp() {
  const [loopTab, go] = useHashRoute()
  const loop = useLoop()

  if (loopTab) return <LoopPage tab={loopTab} onTab={go} onBack={() => go(null)} loop={loop} />

  return (
    <div className="site">
      <KbcAppsTop onLoop={false} onOverview={() => go(null)} onOpenLoop={() => go('home')} />
      <KbcAppsGrid onOpenLoop={() => go('home')} />
      <p className="fine site-disclaimer">Concept prototype for the Tectonic Hackathon, not an official KBC website or app.</p>
    </div>
  )
}
