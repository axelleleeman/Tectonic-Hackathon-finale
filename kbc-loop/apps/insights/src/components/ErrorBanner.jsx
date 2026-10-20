/** Inline error message with an optional retry action. Announced to screen readers when it appears. */
export function ErrorBanner({ title, children, onRetry }) {
  return (
    <div className="ins-alert" role="alert">
      <span className="ins-alert-icon" aria-hidden="true">!</span>
      <div className="ins-min0">
        <b>{title}</b>
        {children && <p>{children}</p>}
      </div>
      {onRetry && <button type="button" className="ins-btn ins-btn-sm" onClick={onRetry}>Try again</button>}
    </div>
  )
}
