import { useEffect, useMemo, useState } from 'react'
import { useLoop } from '@kbc-loop/web-ui/useLoop.js'
import { APP_URL } from '@kbc-loop/web-ui/api.js'
import { Connecting } from '@kbc-loop/web-ui/components/Connecting.jsx'
import { bindActions } from '@kbc-loop/shared/state/actions.js'
import { useAutoplay } from '../hooks/useAutoplay.js'
import { demoScript } from './presenter/demoScript.js'
import { PresenterPanel } from './presenter/PresenterPanel.jsx'
import { PartnerDashboard } from './dashboards/PartnerDashboard.jsx'
import { KbcDashboard } from './dashboards/KbcDashboard.jsx'
import { KbcAppsTop, KbcAppsGrid } from './site/KbcAppsPage.jsx'

// Webweergave: de pagina "Alle apps van KBC" (exacte screenshot) met een klikbaar tabblad KBC Loop.
// De klantenapp (Expo: iOS, Android en web) zit hier in een iframe; web en app praten met dezelfde api.
export default function WebApp() {
  const [onLoop, setOnLoop] = useState(() => window.location.hash === '#loop')
  const { state, dispatch, items, status, error } = useLoop()
  const actions = useMemo(() => bindActions(dispatch), [dispatch])
  const autoplay = useAutoplay(dispatch, demoScript)

  // #loop in de URL opent meteen het tabblad KBC Loop (handig om te delen of op te nemen)
  useEffect(() => { window.history.replaceState(null, '', onLoop ? '#loop' : window.location.pathname) }, [onLoop])

  return (
    <div className="site">
      <KbcAppsTop onLoop={onLoop} onOverview={() => setOnLoop(false)} onOpenLoop={() => setOnLoop(true)} />

      {!onLoop && <KbcAppsGrid onOpenLoop={() => setOnLoop(true)} />}

      {onLoop && !state && <Connecting error={error} />}
      {state && <div className="stage" hidden={!onLoop}>
        <PresenterPanel state={state} items={items} actions={actions} autoplay={autoplay} />

        {state.view === 'partner' && <PartnerDashboard state={state} />}
        {state.view === 'kbc' && <KbcDashboard state={state} />}
        {/* Blijft gemonteerd zodat de app niet herlaadt bij wisselen van perspectief of tabblad */}
        <div className="phone" hidden={state.view !== 'klant'}>
          <div className="notch" />
          <iframe className="screen app-frame" src={APP_URL} title="KBC Mobile – klantenapp" />
        </div>
      </div>}
      {state && status === 'offline' && <div className="offline-badge">Verbinding met de server verbroken, opnieuw proberen…</div>}

      <p className="fine site-disclaimer">Conceptprototype voor de Tectonic Hackathon, geen officiële KBC-website of -app.</p>
    </div>
  )
}
