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

/**
 * "Explore the app": the real KBC Loop mobile app (Expo web, APP_URL) in a CSS phone frame. It talks to the same api,
 * so actions sync live with this page. When the frame does not load in time a fallback card with the link is shown.
 */
export function AppPreview() {
  const fitRef = useRef(null)
  const scale = useFitScale(fitRef)
  const [state, setState] = useState(SAFE_URL ? 'loading' : 'failed') // loading | ready | failed

  useEffect(() => {
    if (state !== 'loading') return undefined
    const t = setTimeout(() => setState((s) => (s === 'loading' ? 'failed' : s)), LOAD_TIMEOUT)
    return () => clearTimeout(t)
  }, [state])

  const w = (SCREEN_W + BEZEL * 2) * scale
  const h = (SCREEN_H + BEZEL * 2) * scale

  return (
    <section className="lp-section lp-appx" aria-labelledby="lp-appx-title">
      <div className="lp-appx-copy">
        <h2 className="lp-h2" id="lp-appx-title">Explore the app</h2>
        <p className="lp-appx-lead">Try the KBC Loop mobile app right here. It is the real app, running on the same live data.</p>
        <ul className="lp-appx-list">
          {HIGHLIGHTS.map((t) => <li key={t}><LoopIcon name="check" size={16} />{t}</li>)}
        </ul>
        {SAFE_URL && (
          <a className="lp-btn" href={SAFE_URL} target="_blank" rel="noopener noreferrer">
            Open full screen<LoopIcon name="arrow" size={16} />
          </a>
        )}
      </div>
      <div className="lp-appx-fit" ref={fitRef}>
        {state === 'failed' ? (
          <div className="lp-card lp-empty lp-appx-fallback">
            <p>The app preview could not be loaded here.</p>
            {SAFE_URL && <a className="lp-btn lp-sm" href={SAFE_URL} target="_blank" rel="noopener noreferrer">Open the app</a>}
          </div>
        ) : (
          <div className="lp-phone-box" style={{ width: w, height: h }}>
            <div className="lp-phone" style={{ transform: `scale(${scale})` }}>
              <span className="lp-phone-notch" aria-hidden="true" />
              {state === 'loading' && <div className="lp-phone-skel" aria-hidden="true" />}
              <iframe src={SAFE_URL} title="KBC Loop mobile app (demo)" loading="lazy" width={SCREEN_W} height={SCREEN_H}
                sandbox="allow-scripts allow-same-origin allow-forms" referrerPolicy="no-referrer"
                onLoad={() => setState('ready')} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
