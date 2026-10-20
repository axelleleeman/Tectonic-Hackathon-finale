// Scroll reveal: one IntersectionObserver per element, CSS does the motion (transform and opacity only).
// Content stays visible without JS, for print and screen readers: `lp-rv-ready` (which hides the parts) is
// only added once the observer is running, and never under prefers-reduced-motion.
import { useEffect, useRef, useState } from 'react'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Returns [ref, shown]. Adds `lp-rv-ready`, then `lp-in` the first time the element scrolls into view. */
export function useReveal({ threshold = 0.25, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (reduced() || !('IntersectionObserver' in window)) { setShown(true); return undefined }
    el.classList.add('lp-rv-ready')
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      el.classList.add('lp-in')
      setShown(true)
      io.disconnect()
    }, { threshold, rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin])
  return [ref, shown]
}

/** Counts from 0 to `value` once `run` is true (ease-out, ~1.1 s). Without motion it shows the final value. */
export function useCountUp(value, run) {
  const [n, setN] = useState(value)
  useEffect(() => {
    if (!run || reduced() || !value) { setN(value); return undefined }
    let raf = 0
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 1100)
      setN(p < 1 ? Math.round(value * (1 - Math.pow(1 - p, 3))) : value)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, run])
  return n
}

/**
 * Scroll-linked progress for word-by-word text: writes `--p` (0 → 1) on the element while it moves through the
 * viewport (0 when its top reaches 85% of the screen, 1 when its middle passes 45%). Words fade in and out with the
 * scroll position. Under prefers-reduced-motion everything is simply shown (`--p: 1`).
 */
export function useScrollProgress(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (reduced()) { el.style.setProperty('--p', '1'); return undefined }
    let raf = 0
    let active = false
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.85
      const end = vh * 0.45 - r.height / 2
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)))
      el.style.setProperty('--p', p.toFixed(3))
    }
    const onScroll = () => { if (active && !raf) raf = requestAnimationFrame(update) }
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver(([e]) => { active = e.isIntersecting; if (active) onScroll() }, { rootMargin: '20% 0px' })
      : null
    if (io) io.observe(el); else active = true
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      io?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [ref])
}
