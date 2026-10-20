import { useEffect, useRef, useState } from 'react'
import { APP_URL } from '@kbc-loop/web-ui/api.js'
import { LoopIcon } from '../LoopIcon.jsx'

const SCREEN_W = 390
const SCREEN_H = 844
const BEZEL = 12
const MAX_SCALE = 0.86
const LOAD_TIMEOUT = 12000

// Only the configured app address is ever framed (no user input); anything that is not http(s) is refused.
const SAFE_URL = /^https?:\/\//.test(APP_URL) || APP_URL.startsWith('/') ? APP_URL : null

const HIGHLIGHTS = [
  'The same products, repairs and costs as on the web, in your pocket.',
  'Live: what you do here shows up in the app, and the other way round.',
  'Report a problem with a photo and follow the repair step by step.',
]

/** Fits the 390×844 screen into the available width (never larger than MAX_SCALE). */
function useFitScale(ref) {
  const [scale, setScale] = useState(MAX_SCALE)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(([entry]) => {
      setScale(Math.min(MAX_SCALE, entry.contentRect.width / (SCREEN_W + BEZEL * 2)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return scale
}

/** Scale that fits the phone into the viewport for the large overlay (never above 1). */
function useViewportScale(active) {
  const calc = () => Math.min(1, (window.innerHeight - 96) / (SCREEN_H + BEZEL * 2), (window.innerWidth - 32) / (SCREEN_W + BEZEL * 2))
  const [scale, setScale] = useState(1)
  useEffect(() => {
    if (!active) return undefined
    const on = () => setScale(calc())
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [active])
  return scale
}

/** The phone frame with the app inside, at a given scale. */
function Phone({ scale, loading, onLoad }) {
  return (
    <div className="lp-phone-box" style={{ width: (SCREEN_W + BEZEL * 2) * scale, height: (SCREEN_H + BEZEL * 2) * scale }}>
      <div className="lp-phone" style={{ transform: `scale(${scale})` }}>
        <span className="lp-phone-notch" aria-hidden="true" />
        {loading && <div className="lp-phone-skel" aria-hidden="true" />}
        <iframe src={SAFE_URL} title="KBC Loop mobile app (demo)" loading="lazy" width={SCREEN_W} height={SCREEN_H}
          sandbox="allow-scripts allow-same-origin allow-forms" referrerPolicy="no-referrer" onLoad={onLoad} />
      </div>
    </div>
  )
}

/** Large, centred app simulator over the page. Closes with the × button, Escape or a click on the backdrop. */
function AppOverlay({ onClose }) {
  const scale = useViewportScale(true)
  const closeRef = useRef(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const opener = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      opener?.focus?.()
    }
  }, [onClose])
  return (
    <div className="lp-appx-overlay" role="dialog" aria-modal="true" aria-label="KBC Loop mobile app" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <button type="button" ref={closeRef} className="lp-appx-close" onClick={onClose} aria-label="Close the app">
        <LoopIcon name="x" size={20} />
      </button>
      <Phone scale={scale} loading={loading} onLoad={() => setLoading(false)} />
    </div>
  )
}

/**
 * "Explore the app": the real KBC Loop mobile app (Expo web, APP_URL) in a CSS phone frame. It talks to the same api,
 * so actions sync live with this page. When the frame does not load in time a fallback card with the link is shown.
 */
export function AppPreview() {
  const fitRef = useRef(null)
  const scale = useFitScale(fitRef)
  const [state, setState] = useState(SAFE_URL ? 'loading' : 'failed') // loading | ready | failed
  const [large, setLarge] = useState(false)

  useEffect(() => {
    if (state !== 'loading') return undefined
    const t = setTimeout(() => setState((s) => (s === 'loading' ? 'failed' : s)), LOAD_TIMEOUT)
    return () => clearTimeout(t)
  }, [state])

  return (
    <section className="lp-section lp-appx" aria-labelledby="lp-appx-title">
      <div className="lp-appx-copy">
        <h2 className="lp-h2" id="lp-appx-title">Explore the app</h2>
        <p className="lp-appx-lead">Try the KBC Loop mobile app right here. It is the real app, running on the same live data.</p>
        <ul className="lp-appx-list">
          {HIGHLIGHTS.map((t) => <li key={t}><LoopIcon name="check" size={16} />{t}</li>)}
        </ul>
        {SAFE_URL && (
          <button type="button" className="lp-btn" onClick={() => setLarge(true)}>
            Open the app large<LoopIcon name="arrow" size={16} />
          </button>
        )}
      </div>
      <div className="lp-appx-fit" ref={fitRef}>
        {state === 'failed' ? (
          <div className="lp-card lp-empty lp-appx-fallback">
            <p>The app preview could not be loaded here.</p>
            {SAFE_URL && <a className="lp-btn lp-sm" href={SAFE_URL} target="_blank" rel="noopener noreferrer">Open the app</a>}
          </div>
        ) : (
          <Phone scale={scale} loading={state === 'loading'} onLoad={() => setState('ready')} />
        )}
      </div>
      {large && <AppOverlay onClose={() => setLarge(false)} />}
    </section>
  )
}
