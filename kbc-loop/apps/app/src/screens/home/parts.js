// Building blocks and sizes shared by the Home sections.
// Rule: only KBC Loop is interactive. Other KBC Mobile parts are wrapped in <Dimmed> (ui/Dimmed.js),
// which makes them light grey and non-interactive; the parts below never mute themselves.
import { StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { Press } from '../../ui/Press.js'
import { Dimmed } from '../../ui/Dimmed.js'
import { Glyph } from './icons.js'
import { cardShadow, colors } from '../../theme.js'

export const GUTTER = 16
export const RADIUS = 12

export const shared = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: RADIUS, ...cardShadow },
  bleed: { marginHorizontal: -GUTTER, flexGrow: 0 },
})

/** Section heading as in KBC Mobile, with an optional link on the right (dimmed unless it has onLink). */
export function Section({ title, link, onLink, compact, children }) {
  const linkEl = link ? <TextLink label={link} onPress={onLink} /> : null
  return (
    <View style={compact ? styles.sectionCompact : styles.section}>
      <View style={styles.head}>
        <T style={styles.title} role="heading">{title}</T>
        {link && !onLink ? <Dimmed>{linkEl}</Dimmed> : linkEl}
      </View>
      {children}
    </View>
  )
}

/** Blue text link. Without onPress it is static text (wrap it in <Dimmed> when it is not KBC Loop). */
export function TextLink({ label, onPress, style }) {
  if (!onPress) return <T style={[styles.link, style]}>{label}</T>
  return (
    <Press onPress={onPress} label={label} hitSlop={8}>
      <T style={[styles.link, style]}>{label}</T>
    </Press>
  )
}

/** Outlined (or filled) pill button. Without onPress it is static (wrap it in <Dimmed> when it is not KBC Loop). */
export function Pill({ label, onPress, filled, color = colors.kmBlue, style }) {
  const box = [styles.pill, filled ? { backgroundColor: color, borderColor: color } : { borderColor: color }, style]
  const text = <T style={[styles.pillText, { color: filled ? '#fff' : color }]}>{label}</T>
  if (!onPress) return <View style={box}>{text}</View>
  return <Press style={box} onPress={onPress} label={label}>{text}</Press>
}

/** "…" menu in the top-right corner of cards (static). */
export function Dots({ style, color = colors.kmNavy }) {
  return (
    <View style={[styles.dots, style]} aria-hidden>
      {[0, 1, 2].map((i) => <View key={i} style={[styles.dot, { backgroundColor: color }]} />)}
    </View>
  )
}

/** Small Kate mark in a light-blue circle. */
export function KateMark({ size = 16 }) {
  return (
    <View style={[styles.kate, { width: size, height: size, borderRadius: size / 2 }]} aria-hidden>
      <Glyph name="kate" size={size * 0.7} color={colors.kmBlue} strokeWidth={2.4} />
    </View>
  )
}

/** Small cross to close a card (UI state only). */
export function CloseX({ onPress, style, label = 'Close' }) {
  return (
    <Press style={[styles.x, style]} onPress={onPress} label={label} hitSlop={10}>
      <Glyph name="close" size={10} color={colors.kmNavy} strokeWidth={2.4} />
    </Press>
  )
}

const styles = StyleSheet.create({
  section: { marginTop: 44 },
  sectionCompact: { marginTop: 28 },
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 },
  title: { fontSize: 19, fontWeight: '500', color: colors.kmNavy, flexShrink: 1 },
  link: { color: colors.kmBlue, fontWeight: '700', fontSize: 15 },
  pill: { alignSelf: 'flex-start', borderWidth: 1.5, borderRadius: 99, paddingHorizontal: 16, paddingVertical: 4 },
  pillText: { fontSize: 16, fontWeight: '500' },
  dots: { flexDirection: 'row', gap: 3, padding: 4 },
  dot: { width: 4.5, height: 4.5, borderRadius: 3 },
  kate: { backgroundColor: '#e3f3fb', alignItems: 'center', justifyContent: 'center' },
  x: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#eef4f9', alignItems: 'center', justifyContent: 'center' },
})
