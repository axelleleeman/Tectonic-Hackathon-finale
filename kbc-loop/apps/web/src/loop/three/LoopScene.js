// Hook that attaches the 3D loop (see buildScene.js) to a canvas.
import { useEffect, useRef } from 'react'

/**
 * Attaches the 3D loop to a <canvas>. `circular` drives the morph (true = loop, false = straight line);
 * `theme` ('light' | 'dark') picks the colour palette; `options.compact` renders a small, centred loop without particles.
 * Silently falls back to the plain background when WebGL is unavailable.
 */
export function useLoopScene(canvasRef, circular, theme, { compact = false } = {}) {
  const api = useRef(null)
  const target = useRef(circular ? 1 : 0) // latest mode, applied once the scene has loaded
  const built = useRef(false) // after the first build (e.g. a theme switch), skip the intro morph

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let s = null
    let cancelled = false
    let raf = 0
    let running = false
    let onScreen = true
    let teardown = () => {}

    // three.js is loaded on demand, so the page (and the KBC apps page) render without waiting for it
    import('./buildScene.js').then(({ buildScene }) => {
      if (cancelled) return
      try { s = buildScene(canvas, reduce, theme, { compact }) } catch { return } // no WebGL: no 3D
      const frame = (now) => { s.render(now); if (running) raf = requestAnimationFrame(frame) }
      const start = () => {
        if (running || !onScreen || document.hidden) return
        if (reduce) { s.render(performance.now()); return }
        running = true
        raf = requestAnimationFrame(frame)
      }
      const stop = () => { running = false; cancelAnimationFrame(raf) }

      const io = new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; if (onScreen) start(); else stop() })
      io.observe(canvas)
      const ro = new ResizeObserver(() => { s.layout(); if (!running) s.render(performance.now()) })
      ro.observe(canvas)
      const onVis = () => (document.hidden ? stop() : start())
      document.addEventListener('visibilitychange', onVis)
      const onMove = (e) => { s.state.mx = e.clientX / window.innerWidth - 0.5 }
      if (!reduce) window.addEventListener('pointermove', onMove, { passive: true })

      s.state.target = target.current
      if (built.current) s.state.k = target.current
      built.current = true
      s.layout()
      api.current = { setTarget: (v) => { s.state.target = v; if (!running) s.render(performance.now()) } }
      start()
      teardown = () => {
        stop()
        io.disconnect()
        ro.disconnect()
        document.removeEventListener('visibilitychange', onVis)
        window.removeEventListener('pointermove', onMove)
        s.dispose()
      }
    })

    return () => {
      cancelled = true
      api.current = null
      teardown()
    }
  }, [canvasRef, theme, compact]) // a theme change rebuilds the scene with the matching palette

  useEffect(() => {
    target.current = circular ? 1 : 0
    api.current?.setTarget(target.current)
  }, [circular])
}
