// Lets a multi-step flow inside a screen (report a problem, upgrade, return, costs) take over the header:
// its own title, and a back button that goes one step back in the flow instead of leaving the screen.
// LoopApp provides the context; the flow that is currently shown registers itself with useFlowChrome.
import { createContext, useContext, useEffect, useRef } from 'react'

export const ChromeContext = createContext({ set: () => {}, clear: () => {}, scrollTop: () => {} })

/**
 * @param {{ title: string, onBack: () => void, stepKey?: string }} chrome
 * stepKey changes per step, so the page scrolls back to the top on every new step.
 */
export function useFlowChrome({ title, onBack, stepKey }) {
  const ctx = useContext(ChromeContext)
  const back = useRef(onBack)
  back.current = onBack
  useEffect(() => {
    const token = {}
    ctx.set({ token, title, back: () => back.current?.() })
    ctx.scrollTop()
    return () => ctx.clear(token)
  }, [ctx, title, stepKey])
}
