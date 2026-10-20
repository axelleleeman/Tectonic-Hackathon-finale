import { APP_URL } from '@kbc-loop/web-ui/api.js'
import { PresenterPanel } from '../demo/presenter/PresenterPanel.jsx'
import { PartnerDashboard } from '../demo/dashboards/PartnerDashboard.jsx'
import { KbcDashboard } from '../demo/dashboards/KbcDashboard.jsx'

// The original demo view: presenter panel, Philips/KBC dashboards and the customer app in an iframe.
// Stays mounted (hidden) so the app in the iframe does not reload when switching tabs.
export function Presentation({ state, items, actions, autoplay, hidden }) {
  return (
    <div className="lp-present" hidden={hidden}>
      <div className="stage">
        <PresenterPanel state={state} items={items} actions={actions} autoplay={autoplay} />
        {state.view === 'partner' && <PartnerDashboard state={state} />}
        {state.view === 'kbc' && <KbcDashboard state={state} />}
        <div className="phone" hidden={state.view !== 'klant'}>
          <div className="notch" />
          <iframe className="screen app-frame" src={APP_URL} title="KBC Mobile customer app" />
        </div>
      </div>
    </div>
  )
}
