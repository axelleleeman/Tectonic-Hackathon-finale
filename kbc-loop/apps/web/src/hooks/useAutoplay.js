// Speelt een lijst acties af met vertraging (presentatiemodus).
import { useEffect, useRef, useState } from 'react'

export function useAutoplay(dispatch, script) {
  const [step, setStep] = useState(-1)
  const timer = useRef(null)

  useEffect(() => {
    if (step < 0) return undefined
    if (step >= script.length) { setStep(-1); return undefined }
    const { action, wait } = script[step]
    dispatch(action)
    timer.current = setTimeout(() => setStep((s) => s + 1), wait)
    return () => clearTimeout(timer.current)
  }, [step, script, dispatch])

  return {
    playing: step >= 0,
    progress: step < 0 ? 0 : (step + 1) / script.length,
    caption: step >= 0 ? script[step]?.caption : null,
    start: () => setStep(0),
    stop: () => setStep(-1),
  }
}
