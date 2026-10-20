// Building blocks shared by the product detail, its flows and the cost screens.
import { Animated, StyleSheet, View } from 'react-native'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { usePop } from '../../ui/usePop.js'
import { Glyph } from './Glyph.js'
import { cardShadow, colors } from '../../theme.js'

export function Card({ style, children, ...rest }) {
  return <View style={[styles.card, style]} {...rest}>{children}</View>
}

/** Title and intro text at the top of a flow step. */
export function StepTitle({ title, intro }) {
  return (
    <View style={styles.titleWrap}>
      <T style={styles.title} role="heading">{title}</T>
      {intro ? <T style={styles.intro}>{intro}</T> : null}
    </View>
  )
}

/** "Step 2 of 3" with a segmented progress bar. */
export function StepProgress({ step, total, label }) {
  return (
    <View style={styles.progress} accessible aria-label={`Step ${step} of ${total}: ${label}`}>
      <View style={styles.segments}>
        {Array.from({ length: total }, (_, n) => <View key={n} style={[styles.segment, n < step && styles.segmentOn]} />)}
      </View>
      <T style={styles.progressText}>Step {step} of {total} · {label}</T>
    </View>
  )
}

/** Selectable row with a radio mark (single choice). */
export function ChoiceRow({ title, sub, selected, onPress, left, right, label }) {
  return (
    <Press onPress={onPress} label={label ?? title} role="radio" aria-checked={selected}
      style={[styles.choice, selected && styles.choiceOn]}>
      {left}
      <View style={styles.choiceText}>
        <T style={styles.choiceTitle}>{title}</T>
        {sub ? <T style={styles.choiceSub}>{sub}</T> : null}
      </View>
      {right}
      <View style={[styles.radio, selected && styles.radioOn]}>{selected ? <View style={styles.radioDot} /> : null}</View>
    </Press>
  )
}

/** Label on the left, value on the right; used in reviews and summaries. */
export function SummaryRow({ label, value, strong, tone, last }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <T style={styles.rowLabel}>{label}</T>
      <T style={[styles.rowValue, strong && styles.rowStrong, tone === 'green' && styles.green]}>{value}</T>
    </View>
  )
}

/** Full-width button. Primary (filled) or secondary (outline); disabled is shown faded. */
export function ActionButton({ children, onPress, disabled, variant = 'primary', label }) {
  const secondary = variant === 'secondary'
  return (
    <Press onPress={disabled ? undefined : onPress} disabled={disabled} label={label}
      style={[styles.button, secondary && styles.buttonSecondary, disabled && styles.buttonDisabled]}>
      <T style={[styles.buttonText, secondary && styles.buttonTextSecondary]}>{children}</T>
    </Press>
  )
}

/** Big check mark, title and text after a completed action. */
export function SuccessHeader({ title, text }) {
  const pop = usePop()
  return (
    <View style={styles.success}>
      <Animated.View style={[styles.check, pop]}><Glyph name="check" size={38} color="#fff" strokeWidth={2.6} /></Animated.View>
      <T style={styles.successTitle} role="heading">{title}</T>
      {text ? <T style={styles.successText}>{text}</T> : null}
    </View>
  )
}

/** Green note with a leaf (circular benefit) or a neutral info note. */
export function Note({ children, tone = 'green' }) {
  const green = tone === 'green'
  return (
    <View style={[styles.note, green ? styles.noteGreen : styles.noteInfo]}>
      <Glyph name={green ? 'leaf' : 'info'} size={18} color={green ? colors.savingInk : colors.kmBlue} />
      <T style={[styles.noteText, green && { color: colors.savingInk }]}>{children}</T>
    </View>
  )
}

export function SectionLabel({ children }) {
  return <T style={styles.sectionLabel} role="heading">{children}</T>
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, ...cardShadow },
  titleWrap: { marginTop: 4, marginBottom: 14 },
  title: { fontSize: 22, fontWeight: '800', color: colors.kmNavy, letterSpacing: -0.3 },
  intro: { color: colors.kmSub, fontSize: 14.5, lineHeight: 21, marginTop: 6 },
  progress: { marginBottom: 14 },
  segments: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 5, borderRadius: 3, backgroundColor: colors.kmLine },
  segmentOn: { backgroundColor: colors.kmBlue },
  progressText: { marginTop: 8, fontSize: 12.5, fontWeight: '600', color: colors.kmSub },
  choice: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1.5, borderColor: 'transparent', ...cardShadow,
  },
  choiceOn: { borderColor: colors.kmBlue, backgroundColor: '#f5fbff' },
  choiceText: { flex: 1 },
  choiceTitle: { fontWeight: '700', fontSize: 15, color: colors.kmNavy },
  choiceSub: { color: colors.kmSub, fontSize: 13, marginTop: 3, lineHeight: 18 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#c3d1df', alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.kmBlue },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.kmBlue },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.kmLine },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { flex: 1, color: colors.kmSub, fontSize: 14 },
  rowValue: { flexShrink: 1, textAlign: 'right', fontSize: 14.5, fontWeight: '600', color: colors.kmNavy },
  rowStrong: { fontWeight: '800', fontSize: 16 },
  green: { color: colors.savingInk },
  button: { backgroundColor: colors.button, paddingVertical: 15, borderRadius: 99, marginTop: 14, alignItems: 'center' },
  buttonSecondary: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#cfe0ee', marginTop: 10 },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15.5 },
  buttonTextSecondary: { color: colors.kmNavy },
  success: { alignItems: 'center', paddingTop: 18, paddingBottom: 6 },
  check: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', boxShadow: '0px 8px 20px rgba(26,163,111,0.3)' },
  successTitle: { fontSize: 23, fontWeight: '800', color: colors.kmNavy, marginTop: 16, textAlign: 'center' },
  successText: { color: colors.kmSub, fontSize: 14.5, lineHeight: 21, textAlign: 'center', marginTop: 8, paddingHorizontal: 8 },
  note: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', borderRadius: 12, padding: 12, marginTop: 12 },
  noteGreen: { backgroundColor: colors.savingBg },
  noteInfo: { backgroundColor: colors.kmSky },
  noteText: { flex: 1, fontSize: 13.5, lineHeight: 19, color: colors.kmNavy },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: colors.kmSub, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 22, marginBottom: 10 },
})
