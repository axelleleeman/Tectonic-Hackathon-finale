// Bouwstenen en maten die de secties van de startpagina delen.
// Regel: enkel KBC Loop is klikbaar. Andere KBC Mobile-knoppen zijn zichtbaar maar gedempt en niet aanraakbaar.
import { StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { Press } from '../../ui/Press.js'
import { Glyph } from './icons.js'
import { cardShadow, colors } from '../../theme.js'

export const GUTTER = 16
export const RADIUS = 12

export const tone = {
  muted: '#86bedd', // gedempte link of knop van een niet-klikbare KBC Mobile-functie
  mutedLine: '#bcdcee',
  sub: colors.kmSub,
  grey: colors.kmGrey,
  green: '#1f9d55',
  greenSoft: '#e7f8ea',
  loop: colors.kmBlue,
}

export const shared = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: RADIUS, ...cardShadow },
  bleed: { marginHorizontal: -GUTTER, flexGrow: 0 },
})

/** Sectiekop zoals in KBC Mobile, met optionele link rechts. */
export function Section({ title, link, onLink, compact, children }) {
  return (
    <View style={compact ? styles.sectionCompact : styles.section}>
      <View style={styles.head}>
        <T style={styles.title} role="heading">{title}</T>
        {link ? <TextLink label={link} onPress={onLink} /> : null}
      </View>
      {children}
    </View>
  )
}

/** Tekstlink: blauw en klikbaar voor KBC Loop, anders gedempt en statisch. */
export function TextLink({ label, onPress, style }) {
  if (!onPress) return <T style={[styles.link, styles.linkMuted, style]}>{label}</T>
  return (
    <Press onPress={onPress} label={label} hitSlop={8}>
      <T style={[styles.link, style]}>{label}</T>
    </Press>
  )
}

/** Pilknop met rand (of gevuld). Zonder onPress: gedempt en niet aanraakbaar. */
export function Pill({ label, onPress, filled, color = colors.kmBlue, mutedColor = tone.muted, style }) {
  const c = onPress ? color : mutedColor
  const box = [styles.pill, filled ? { backgroundColor: c, borderColor: c } : { borderColor: c }, style]
  const text = <T style={[styles.pillText, { color: filled ? '#fff' : c }]}>{label}</T>
  if (!onPress) return <View style={box}>{text}</View>
  return <Press style={box} onPress={onPress} label={label}>{text}</Press>
}

/** "…"-menu rechtsboven op kaarten (niet klikbaar). */
export function Dots({ style, color = colors.kmNavy }) {
  return (
    <View style={[styles.dots, style]} aria-hidden>
      {[0, 1, 2].map((i) => <View key={i} style={[styles.dot, { backgroundColor: color }]} />)}
    </View>
  )
}

/** Klein Kate-teken in een lichtblauw rondje. */
export function KateMark({ size = 16 }) {
  return (
    <View style={[styles.kate, { width: size, height: size, borderRadius: size / 2 }]} aria-hidden>
      <Glyph name="kate" size={size * 0.7} color={colors.kmBlue} strokeWidth={2.4} />
    </View>
  )
}

/** Klein kruisje om een kaart te sluiten (enkel UI-state). */
export function CloseX({ onPress, style, label = 'Sluiten' }) {
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
  linkMuted: { color: tone.muted },
  pill: { alignSelf: 'flex-start', borderWidth: 1.5, borderRadius: 99, paddingHorizontal: 16, paddingVertical: 4 },
  pillText: { fontSize: 16, fontWeight: '500' },
  dots: { flexDirection: 'row', gap: 3, padding: 4 },
  dot: { width: 4.5, height: 4.5, borderRadius: 3 },
  kate: { backgroundColor: '#e3f3fb', alignItems: 'center', justifyContent: 'center' },
  x: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#eef4f9', alignItems: 'center', justifyContent: 'center' },
})
