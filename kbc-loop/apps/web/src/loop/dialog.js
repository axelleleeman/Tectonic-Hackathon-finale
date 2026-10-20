// Keyboard handling for dialogs: focus moves into the dialog on open and Tab cycles within it.
// Escape and focus restore are handled centrally in LoopPage (so a modal on top of the drawer closes first).
import { useEffect, useRef } from 'react'

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useDialog() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const first = el.querySelector('[data-autofocus]') ?? el.querySelector(FOCUSABLE)
    first?.focus()
  }, [])

  const onKeyDown = (e) => {
    if (e.key !== 'Tab' || !ref.current) return
    const list = [...ref.current.querySelectorAll(FOCUSABLE)]
    if (!list.length) return
    const first = list[0]
    const last = list[list.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }

  return { ref, onKeyDown }
}
