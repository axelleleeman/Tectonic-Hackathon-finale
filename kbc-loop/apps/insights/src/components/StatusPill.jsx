export function StatusPill({ status }) {
  const running = status === 'running'
  return <span className={`ins-pill ${running ? 'ins-pill-live' : ''}`}><span className="ins-dot" aria-hidden="true" />{running ? 'Running' : 'Stopped'}</span>
}
