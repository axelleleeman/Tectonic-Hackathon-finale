// Launcher + panel with local open/closed state: the simplest way to put Kate in a page header.
import { useCallback, useState } from 'react'
import { KateLauncher } from './KateLauncher.jsx'
import { KatePanel } from './KatePanel.jsx'

/** Props: KateLauncher's `appearance`, `tone`, `className` and KatePanel's `loop`, `onRepair`, `onProduct`, `onOverview`. */
export function Kate({ appearance, tone, className, ...panelProps }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  return (
    <>
      <KateLauncher open={open} onOpen={() => setOpen(true)} appearance={appearance} tone={tone} className={className} />
      <KatePanel open={open} onClose={close} {...panelProps} />
    </>
  )
}
