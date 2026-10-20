import { API_URL } from '@kbc-loop/web-ui/api.js'
import { ErrorBanner } from './ErrorBanner.jsx'
import { PageSkeleton } from './Skeleton.jsx'

/** Shown until the api answers: a skeleton of the page, or an error banner when the api cannot be reached. */
export function Loading({ error }) {
  if (error) {
    return (
      <ErrorBanner title="Cannot reach the KBC Loop server" onRetry={() => window.location.reload()}>
        {error}. Start the api with <code>npm run dev:api</code> (expected at {API_URL}).
      </ErrorBanner>
    )
  }
  return (
    <div role="status" aria-busy="true">
      <span className="ins-sr">Loading insights…</span>
      <PageSkeleton />
    </div>
  )
}
