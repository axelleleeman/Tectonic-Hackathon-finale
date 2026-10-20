import { useEffect, useRef } from 'react'

/** Page title block. The heading takes focus on mount so keyboard and screen-reader users land on the new page. */
export function PageHead({ eyebrow, title, children, actions }) {
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus({ preventScroll: true }) }, [title])
  return (
    <div className="ins-pagehead">
      <div className="ins-min0">
        {eyebrow && <p className="ins-eyebrow">{eyebrow}</p>}
        <h1 ref={ref} tabIndex={-1}>{title}</h1>
        {children && <p className="ins-lead">{children}</p>}
      </div>
      {actions && <div className="ins-pagehead-actions">{actions}</div>}
    </div>
  )
}
