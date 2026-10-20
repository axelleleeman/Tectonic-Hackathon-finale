import { useEffect, useRef, useState } from 'react'
import { useLoopScene } from '../three/LoopScene.js'
import { useMediaQuery } from '../useMediaQuery.js'
import { LoopIcon } from '../LoopIcon.jsx'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Two-act story, on repeat: linear (the ball falls off the end) → circular (products stay in the loop).
const ACT = { linear: 6000, circular: 6000 }
const DROP_AT = 4600 // ms into the linear act: the ball leaves the line (morph 1.5 s + run 3 s, see buildScene.js)
const LOOP_AT = 1500 // ms into the circular act: the morph has settled

/** Drives the acts; returns whether the scene is circular and which caption (if any) is showing. */
function useStory(reduce) {
  const [act, setAct] = useState(reduce ? 'circular' : 'linear')
  const [caption, setCaption] = useState(reduce ? 'circular' : null)
  useEffect(() => {
    if (reduce) { setAct('circular'); setCaption('circular'); return undefined }
    setCaption(null)
    const show = setTimeout(() => setCaption(act), act === 'linear' ? DROP_AT : LOOP_AT)
    const next = setTimeout(() => setAct(act === 'linear' ? 'circular' : 'linear'), ACT[act])
    return () => { clearTimeout(show); clearTimeout(next) }
  }, [act, reduce])
  return { circular: act === 'circular', caption }
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
  const { circular, caption } = useStory(reduce)
  useLoopScene(canvasRef, circular, 'dark', { compact: narrow })
  return (
    <>
      <canvas ref={canvasRef} className="lp-gl" aria-hidden="true" />
      <div className="lp-story" aria-hidden="true">
        <span className={`lp-story-cap lp-story-loss ${caption === 'linear' ? 'lp-on' : ''}`}><i className="lp-story-dot" />Costly material loss</span>
      </div>
      <div className="lp-wrap lp-story-copy" aria-hidden="true">
        <span className={`lp-story-cap lp-story-keep ${caption === 'circular' ? 'lp-on' : ''}`}><i className="lp-story-dot" />Products stay in the loop</span>
      </div>
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
