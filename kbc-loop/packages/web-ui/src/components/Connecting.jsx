import { API_URL } from '../api.js'

// Getoond zolang er geen verbinding is met de api.
export function Connecting({ error }) {
  return (
    <div className="connecting" role="status">
      <b>{error ? 'No connection to the KBC Loop server' : 'Connecting to the KBC Loop server…'}</b>
      {error && <small>{error}. Start the API with <code>npm run dev:api</code> (expected at {API_URL}).</small>}
    </div>
  )
}
