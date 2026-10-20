import { useMemo } from 'react'
import { useLoop } from '../state/useLoop.js'
import { bindActions } from '../state/actions.js'
import { useAutoplay } from '../hooks/useAutoplay.js'
import { demoScript } from './presenter/demoScript.js'
import { PresenterPanel } from './presenter/PresenterPanel.jsx'
import { PartnerDashboard } from './dashboards/PartnerDashboard.jsx'
import { KbcDashboard } from './dashboards/KbcDashboard.jsx'

// Webweergave: presentatiepaneel en dashboards. De klantenapp is een aparte pagina (app.html);
// hier zit ze in een iframe en deelt ze dezelfde state via useLoop.
export default function WebApp() {
  const { state, dispatch, items } = useLoop()
  const actions = useMemo(() => bindActions(dispatch), [dispatch])
  const autoplay = useAutoplay(dispatch, demoScript)

  return (
    <div className="stage">
      <PresenterPanel state={state} items={items} actions={actions} autoplay={autoplay} />

      {state.view === 'partner' && <PartnerDashboard state={state} />}
      {state.view === 'kbc' && <KbcDashboard state={state} />}
      {/* Blijft gemonteerd zodat de app niet herlaadt bij wisselen van perspectief */}
      <div className="phone" hidden={state.view !== 'klant'}>
        <div className="notch" />
        <iframe className="screen app-frame" src="app.html" title="KBC Mobile – klantenapp" />
      </div>
    </div>
  )
}
