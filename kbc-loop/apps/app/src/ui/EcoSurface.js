// EcoSurface: the super subtle, half-transparent blue→green wash (deck ring #4AABEE → #3FC98A) with a
// hairline in the same family, for sustainability elements only (CO₂, second life, refurbished, plant a tree).
// Same token as `.lp-eco-surface` on the web. The gradient sits behind the children over the element's own
// background (white by default), so text keeps its normal colours and AA contrast.
import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

export const ECO_GRADIENT = ['rgba(74, 171, 238, 0.08)', 'rgba(63, 201, 138, 0.13)']
export const ECO_LINE = 'rgba(47, 160, 140, 0.24)'
/** Slightly stronger variant for navy surfaces (e.g. the share card). */
export const ECO_GRADIENT_DARK = ['rgba(74, 171, 238, 0.12)', 'rgba(63, 201, 138, 0.17)']
export const ECO_LINE_DARK = 'rgba(92, 200, 138, 0.28)'

/**
 * A View with the eco surface behind its children; pass the usual layout/radius/shadow in `style`.
 * `tone="dark"` for navy backgrounds (transparent base), `bordered={false}` for rows inside a list card.
 */
export function EcoSurface({ style, tone = 'light', bordered = true, children, ...rest }) {
  const dark = tone === 'dark'
  const flat = StyleSheet.flatten(style) ?? {}
  const radius = {
    borderRadius: flat.borderRadius ?? 0,
    borderTopLeftRadius: flat.borderTopLeftRadius, borderTopRightRadius: flat.borderTopRightRadius,
    borderBottomLeftRadius: flat.borderBottomLeftRadius, borderBottomRightRadius: flat.borderBottomRightRadius,
  }
  return (
    <View style={[dark ? styles.baseDark : styles.base, style, bordered && (dark ? styles.lineDark : styles.line)]} {...rest}>
      <LinearGradient colors={dark ? ECO_GRADIENT_DARK : ECO_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, radius]} pointerEvents="none" />
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base: { backgroundColor: '#fff' },
  baseDark: { backgroundColor: 'transparent' },
  line: { borderWidth: StyleSheet.hairlineWidth * 2, borderColor: ECO_LINE },
  lineDark: { borderWidth: StyleSheet.hairlineWidth * 2, borderColor: ECO_LINE_DARK },
})
