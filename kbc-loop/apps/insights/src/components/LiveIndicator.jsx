const LABEL = { online: 'Live', connecting: 'Connecting…', offline: 'Offline' }

/** Connection state of the live link to the KBC Loop server (WebSocket), with a pulsing dot when live. */
export function LiveIndicator({ status = 'connecting' }) {
  return (
    <span className={`ins-live ins-live-${status}`} title="Connection to the KBC Loop server">
      <span className="ins-live-dot" aria-hidden="true" />
      <span className="ins-sr">Server connection: </span>
      {LABEL[status] ?? status}
    </span>
  )
}
