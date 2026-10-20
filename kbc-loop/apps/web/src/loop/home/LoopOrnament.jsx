import { useEffect, useRef, useState } from 'react'
import { useLoopScene } from '../three/LoopScene.js'
import { useMediaQuery } from '../useMediaQuery.js'

function Scene({ theme }) {
  const canvasRef = useRef(null)
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  // Starts as a straight line and morphs into the loop (immediately with reduced motion)
  const [circular, setCircular] = useState(reduce)
  useEffect(() => {
    const t = setTimeout(() => setCircular(true), reduce ? 0 : 900)
    return () => clearTimeout(t)
  }, [reduce])
  useLoopScene(canvasRef, circular, theme, { compact: true })
  return <canvas ref={canvasRef} className="lp-ornament" aria-hidden="true" />
}

/**
 * Small decorative 3D loop next to the metrics title. Only mounted on wider screens, so phones never
 * create a WebGL context; the scene pauses off-screen and is disposed on unmount (see three/LoopScene.js).
 */
export function LoopOrnament({ theme }) {
  const wide = useMediaQuery('(min-width: 761px)')
  return wide ? <Scene theme={theme} /> : null
}
