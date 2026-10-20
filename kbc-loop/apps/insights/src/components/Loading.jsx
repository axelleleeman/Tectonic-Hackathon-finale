import { API_URL } from '@kbc-loop/web-ui/api.js'

/** Shown until the api answers (or when it cannot be reached). */
export function Loading({ error }) {
  return (
    <div className="ins-wrap ins-loading" role="status">
      <div className="ins-card ins-pad">
        <b>{error ? 'Cannot reach the KBC Loop server' : 'Connecting to the KBC Loop server…'}</b>
        {error && <p className="ins-muted">{error}. Start the api with <code>npm run dev:api</code> (expected at {API_URL}).</p>}
      </div>
    </div>
  )
}
