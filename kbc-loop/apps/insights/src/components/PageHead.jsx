import { useEffect, useRef } from 'react'
import { Icon } from './Icon.jsx'

/**
 * Page title as a navy band across the full width (navy in light and dark, like the KBC LOOP app header).
 * `back` adds a link above the title, `below` renders extra content in the band (KPI tiles, toolbar).
 * The heading takes focus on mount so keyboard and screen-reader users land on the new page.
 */
export function PageHead({ eyebrow, title, children, actions, back, below }) {
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus({ preventScroll: true }) }, [title])
  return (
    <div className="ins-hero ins-navy">
      {back && <a className="ins-backlink" href={back.href}><Icon name="back" size={16} />{back.label}</a>}
      <div className="ins-pagehead">
        <div className="ins-min0">
          {eyebrow && <div className="ins-eyebrow">{eyebrow}</div>}
          <h1 ref={ref} tabIndex={-1}>{title}</h1>
          {children && <p className="ins-lead">{children}</p>}
        </div>
        {actions && <div className="ins-pagehead-actions">{actions}</div>}
      </div>
      {below}
    </div>
  )
}
