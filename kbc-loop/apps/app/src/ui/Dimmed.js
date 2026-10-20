// Mutes everything that is not KBC Loop: the children are faded and covered by a light-grey veil.
// The whole area is non-interactive (the veil takes every touch), hidden from screen readers and,
// on the web, made inert so nothing inside can receive keyboard focus. Layout stays identical:
// the wrapper is a plain View and the veil is absolutely positioned on top.
import { createContext, useContext, useEffect, useRef } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

export const DIM_OPACITY = 0.55
export const VEIL_COLOR = 'rgba(243,245,248,0.6)'

// Set inside a Dimmed area, so nested Dimmed wrappers do not fade the same content twice.
const InsideDimmed = createContext(false)

/** Marks a web DOM node as inert (no focus, no clicks, not in the accessibility tree). */
function useInert(ref) {
  useEffect(() => {
    if (Platform.OS !== 'web') return
    const node = ref.current
    if (!node || typeof node.setAttribute !== 'function') return
    node.inert = true
    node.setAttribute('inert', '')
  }, [ref])
}

/**
 * @param bleed  how far the veil extends left and right beyond the wrapper (for full-width sections)
 * @param radius corner radius of the veil (round buttons, cards)
 * @param style  layout style of the wrapper (e.g. a row of tiles, or absolute positioning)
 */
export function Dimmed({ children, style, bleed = 0, radius = 0 }) {
  const nested = useContext(InsideDimmed)
  if (nested) return style ? <View style={style}>{children}</View> : children
  return <DimmedArea style={style} bleed={bleed} radius={radius}>{children}</DimmedArea>
}

function DimmedArea({ children, style, bleed, radius }) {
  const ref = useRef(null)
  useInert(ref)
  return (
    <View ref={ref} style={[style, styles.wrap]}
      aria-hidden importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <View style={[styles.content, flattenLayout(style)]}>
        <InsideDimmed.Provider value>{children}</InsideDimmed.Provider>
      </View>
      <View style={[styles.veil, { left: -bleed, right: -bleed, borderRadius: radius }]} />
    </View>
  )
}

// Row/gap layout of the wrapper must also apply to the faded content inside it.
const LAYOUT_KEYS = ['flexDirection', 'flexWrap', 'gap', 'rowGap', 'columnGap', 'alignItems', 'justifyContent']
function flattenLayout(style) {
  const flat = StyleSheet.flatten(style) ?? {}
  const out = {}
  for (const k of LAYOUT_KEYS) if (flat[k] !== undefined) out[k] = flat[k]
  if (flat.flex !== undefined || flat.flexGrow !== undefined) out.flexGrow = 1
  return out
}

const styles = StyleSheet.create({
  wrap: { pointerEvents: 'box-only' },
  content: { opacity: DIM_OPACITY },
  veil: { position: 'absolute', top: 0, bottom: 0, backgroundColor: VEIL_COLOR },
})
