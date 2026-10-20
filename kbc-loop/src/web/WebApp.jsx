import { useEffect, useMemo, useState } from 'react'
import { useLoop } from '../state/useLoop.js'
import { bindActions } from '../state/actions.js'
import { useAutoplay } from '../hooks/useAutoplay.js'
import { demoScript } from './presenter/demoScript.js'
import { PresenterPanel } from './presenter/PresenterPanel.jsx'
import { PartnerDashboard } from './dashboards/PartnerDashboard.jsx'
import { KbcDashboard } from './dashboards/KbcDashboard.jsx'
import { SiteHeader } from './site/SiteHeader.jsx'
import { AppsOverview } from './site/AppsOverview.jsx'

const TABS = ['Overzicht', 'Smartphone', 'Tablet', 'PC']

// Webweergave in de stijl van de pagina "Alle apps van KBC". Enkel Overzicht en het nieuwe tabblad
// KBC Loop zijn klikbaar. De klantenapp is een aparte pagina (app.html); hier zit ze in een iframe
// en deelt ze dezelfde state via useLoop.
export default function WebApp() {
  const [tab, setTab] = useState(() => (window.location.hash === '#loop' ? 'loop' : 'Overzicht'))
  const { state, dispatch, items } = useLoop()
  const actions = useMemo(() => bindActions(dispatch), [dispatch])
  const autoplay = useAutoplay(dispatch, demoScript)
  const onLoop = tab === 'loop'

  // #loop in de URL opent meteen het tabblad KBC Loop (handig om te delen of op te nemen)
  useEffect(() => { window.history.replaceState(null, '', onLoop ? '#loop' : window.location.pathname) }, [onLoop])

  return (
    <div className="site">
      <SiteHeader />

      <section className="site-hero">
        <h1>{onLoop ? 'KBC Loop: lenen in plaats van kopen' : 'Alle apps van KBC op een rijtje'}</h1>
      </section>

      <div className="site-body">
        <div className="crumbs"><span className="off-link">Home</span> › {onLoop ? 'KBC Loop' : 'Alle apps van KBC op een rijtje'}</div>

        <nav className="site-tabs">
          {TABS.map((t) => (
            t === 'Overzicht'
              ? <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>
              : <span key={t} className="off-link">{t}</span>
          ))}
          <button className={`loop-tab ${onLoop ? 'on' : ''}`} onClick={() => setTab('loop')}>KBC Loop <em>Nieuw</em></button>
        </nav>

        {!onLoop && <AppsOverview onOpenLoop={() => setTab('loop')} />}

        <div className="stage" hidden={!onLoop}>
          <PresenterPanel state={state} items={items} actions={actions} autoplay={autoplay} />

          {state.view === 'partner' && <PartnerDashboard state={state} />}
          {state.view === 'kbc' && <KbcDashboard state={state} />}
          {/* Blijft gemonteerd zodat de app niet herlaadt bij wisselen van perspectief of tabblad */}
          <div className="phone" hidden={state.view !== 'klant'}>
            <div className="notch" />
            <iframe className="screen app-frame" src="app.html" title="KBC Mobile – klantenapp" />
          </div>
        </div>
      </div>

      <p className="fine site-disclaimer">Conceptprototype voor de Tectonic Hackathon, geen officiële KBC-website of -app.</p>
    </div>
  )
}
