import { useEffect } from 'react'
import { useLoop } from '@kbc-loop/web-ui/useLoop.js'
import { useHashRoute } from '../hooks/useHashRoute.js'
import { LoopPage } from '../loop/LoopPage.jsx'
import { useTheme } from '../loop/useTheme.js'
import { PartnerPortal } from './dashboards/PartnerDashboard.jsx'

// Web view: thin router for the KBC LOOP portal. The site opens straight on the KBC LOOP start screen (#loop);
// #partner is the partner portal. Web, app and dashboards share one api and database.
export default function WebApp() {
  const { route, param, go } = useHashRoute()
  const loop = useLoop()
  const { theme, toggle } = useTheme()

  // No (or an unknown) hash: land directly on the portal, without adding a history entry.
  useEffect(() => {
    if (!route) window.history.replaceState(null, '', '#loop')
  }, [route])

  if (route === 'partner') return <PartnerPortal loop={loop} theme={theme} onToggleTheme={toggle} onBack={() => go('home')} />
  return <LoopPage route={route ?? 'home'} param={param} go={go} loop={loop} />
}
