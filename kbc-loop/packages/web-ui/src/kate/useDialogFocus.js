// Modal dialog behaviour: Escape closes, Tab stays inside the dialog, the page behind does not scroll,
// and on close focus returns to the element that opened the dialog (then `onClosed` runs).
import { useEffect, useRef } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useDialogFocus({ dialogRef, initialFocusRef, onClose, onClosed }) {
  const close = useRef(onClose)
  const closed = useRef(onClosed)
  useEffect(() => { close.current = onClose; closed.current = onClosed }, [onClose, onClosed])

  useEffect(() => {
    const opener = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    initialFocusRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close.current?.(); return }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const nodes = [...dialogRef.current.querySelectorAll(FOCUSABLE)]
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const inside = dialogRef.current.contains(document.activeElement)
      if (e.shiftKey && (document.activeElement === first || !inside)) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && (document.activeElement === last || !inside)) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      if (opener instanceof HTMLElement && document.contains(opener)) opener.focus()
      closed.current?.()
    }
  }, [dialogRef, initialFocusRef])
}
