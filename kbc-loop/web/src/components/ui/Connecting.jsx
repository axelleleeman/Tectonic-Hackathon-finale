import { API_URL } from '../../api.js'

// Getoond zolang er geen verbinding is met de api.
export function Connecting({ error }) {
  return (
    <div className="connecting" role="status">
      <b>{error ? 'Geen verbinding met de KBC Loop-server' : 'Verbinden met de KBC Loop-server…'}</b>
      {error && <small>{error}. Start de api met <code>npm run dev:api</code> (verwacht op {API_URL}).</small>}
    </div>
  )
}
