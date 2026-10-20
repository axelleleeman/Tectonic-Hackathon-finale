import { useEffect, useRef, useState } from 'react'
import { useLoopScene } from '../three/LoopScene.js'
import { useMediaQuery } from '../useMediaQuery.js'
import { LoopIcon } from '../LoopIcon.jsx'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Two-act story, on repeat: linear (used once, then lost) → circular (products stay in the loop).
const ACT_MS = 6000
const CAPTION = {
  linear: 'Linear: used once, then lost as costly material loss.',
  circular: 'Circular: products stay in the loop.',
}

/** Alternates the scene between linear and circular; reduced motion stays on the circular end state. */
function useStory(reduce) {
  const [circular, setCircular] = useState(reduce)
  useEffect(() => {
    if (reduce) { setCircular(true); return undefined }
    const id = setInterval(() => setCircular((c) => !c), ACT_MS)
    return () => clearInterval(id)
  }, [reduce])
  return circular
}

/**
 * The 3D loop with its two acts. Always the navy palette (the hero is navy in light and dark mode).
 * Phones get the lighter compact scene (no particle field). Reduced motion shows the static end state.
 * The scene pauses off-screen and is disposed on unmount (see three/LoopScene.js).
 */
function Scene() {
  const canvasRef = useRef(null)
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  const narrow = useMediaQuery('(max-width: 759px)')
  const circular = useStory(reduce)
  useLoopScene(canvasRef, circular, 'dark', { compact: narrow })
  return (
    <>
      <canvas ref={canvasRef} className="lp-gl" aria-hidden="true" />
      <p className="lp-story-line" aria-hidden="true">
        <span key={circular ? 'c' : 'l'}>{CAPTION[circular ? 'circular' : 'linear']}</span>
      </p>
      <p className="lp-sr">Animation: in a linear model products are used once and lost as waste; with KBC LOOP they stay in the loop through repair, upgrade and reuse.</p>
    </>
  )
}

/**
 * Full-viewport navy hero of the start screen: "KBC LOOP", one short line and a scroll cue.
 * `onOver(true | false)` reports whether the hero is still under the sticky header (for its transparent style).
 */
export function Hero({ targetId, onOver }) {
  const sentinel = useRef(null)
  useEffect(() => {
    const el = sentinel.current
    if (!el || !onOver) return undefined
    const io = new IntersectionObserver(([e]) => onOver(e.isIntersecting), { rootMargin: '-81px 0px 0px 0px' })
    io.observe(el)
    return () => { io.disconnect(); onOver(false) }
  }, [onOver])

  const scrollDown = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <section className="lp-hero" aria-labelledby="lp-hero-title">
      <Scene />
      <div className="lp-wrap lp-hero-in">
        <div className="lp-hero-copy">
          <h1 id="lp-hero-title">KBC LOOP</h1>
          <p>Use instead of own.</p>
        </div>
      </div>
      <button type="button" className="lp-scrollcue" onClick={scrollDown} aria-label="Scroll to your home">
        <LoopIcon name="chev" size={22} />
      </button>
      <span ref={sentinel} className="lp-hero-end" aria-hidden="true" />
    </section>
  )
}
