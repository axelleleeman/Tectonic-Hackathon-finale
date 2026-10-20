// Opens Kate from a page header. Two looks:
//   appearance="search": a search-style field "How can I help?" with the Kate label, like KBC Mobile
//   appearance="button": a compact Kate mark + "Kate"
// tone="dark" for dark headers (KBC LOOP), tone="light" for light KBC pages.
import { forwardRef } from 'react'
import { KateIcon } from './KateIcon.jsx'
import './kate.css'

export const KateLauncher = forwardRef(function KateLauncher(
  { onOpen, open = false, appearance = 'search', tone = 'dark', className = '' }, ref,
) {
  return (
    <button ref={ref} type="button" onClick={onOpen} aria-haspopup="dialog" aria-expanded={open}
      aria-label="Ask Kate, your AI assistant"
      className={`kate-launcher kate-launcher-${appearance} kate-tone-${tone} ${className}`.trim()}>
      <span className="kate-launcher-mark" aria-hidden="true"><KateIcon name="kate" size={16} strokeWidth={2} /></span>
      {appearance === 'search' && <span className="kate-launcher-hint">How can I help?</span>}
      <span className="kate-launcher-name">Kate</span>
    </button>
  )
})
