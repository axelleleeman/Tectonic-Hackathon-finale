// "Tips from Kate" on Loop > Home: every current Kate signal as a navy card that reads top to bottom as
// expenditure pattern (12-month sparkline, highlighted transaction) → data insight → Kate's recommendation
// (short line, price, main action, "Dismiss", "Why?"). Data from @kbc-loop/shared/kate/tipVisual.js, shared with the web.
// A small "Kate level" chip opens the consent screen; on the Basic level Kate shows no tips at all.
import { useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Circle, Defs, Line, LinearGradient as SvgGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg'
import { tipVisual } from '@kbc-loop/shared/kate/tipVisual.js'
import { PREVENTIVE_ISSUE } from '@kbc-loop/shared/data/index.js'
import { KATE_LEVELS, kateLevelOf } from '@kbc-loop/shared/data/dataChoices.js'
import { Icon } from '../../ui/Icon.js'
import { KateAvatar } from '../../ui/KateAvatar.js'
import { Press } from '../../ui/Press.js'
import { SectionHeader } from '../../ui/SectionHeader.js'
import { T } from '../../ui/T.js'
import { TAP, font, radius, space, tabular } from '../../ui/tokens.js'
import { colors } from '../../theme.js'

function titleOf(signal) {
  if (signal.notification?.title) return signal.notification.title
  return signal.source === 'toestel' ? 'Your light needs attention' : 'A tip for you'
}

const SVG_FONT = Platform.OS === 'web' ? "'IBM Plex Sans', system-ui, sans-serif" : undefined
const W = 300
const H = 128
const TOP = 30
const BOTTOM = 100
const L = 10
const R = 286

/** 12-month sparkline with the highlighted transaction, its amount chip and the first/last month initials. Decorative. */
function Sparkline({ visual }) {
  const [width, setWidth] = useState(0)
  const { series, chip } = visual
  const max = Math.max(...series.points.map((p) => p.value)) * 1.08 || 1
  const step = (R - L) / (series.points.length - 1)
  const pts = series.points.map((p, i) => ({ ...p, x: L + i * step, y: BOTTOM - (p.value / max) * (BOTTOM - TOP) }))
  const hi = pts[series.highlight]
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L${R} ${BOTTOM} L${L} ${BOTTOM} Z`
  const chipW = Math.max(48, chip.length * 7.6 + 18)
  const chipX = Math.max(2, Math.min(hi.x - chipW / 2, R - chipW + 10))
  const chipY = Math.max(2, hi.y - 34)
  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} aria-hidden importantForAccessibility="no-hide-descendants">
      {width > 0 ? (
        <Svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`}>
          <Defs>
            <SvgGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#4AABEE" stopOpacity="0.32" /><Stop offset="1" stopColor="#4AABEE" stopOpacity="0" />
            </SvgGradient>
          </Defs>
          <Line x1={L} y1={BOTTOM} x2={R} y2={BOTTOM} stroke="#FFFFFF" strokeOpacity="0.1" />
          <Path d={area} fill="url(#area)" />
          <Path d={line} fill="none" stroke="#4AABEE" strokeOpacity="0.35" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
          <Path d={line} fill="none" stroke="#4AABEE" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {pts.filter((p) => p.marked).map((p) => <Circle key={p.key} cx={p.x} cy={p.y} r="4.5" fill="#F0A15A" stroke="#0B2A5B" strokeWidth="2" />)}
          <Rect x={chipX} y={chipY} width={chipW} height="24" rx="12" fill="#4AABEE" fillOpacity="0.22" stroke="#4AABEE" />
          <SvgText fontFamily={SVG_FONT} x={chipX + chipW / 2} y={chipY + 16.5} textAnchor="middle" fontSize="12" fontWeight="600" fill="#FFFFFF">{chip}</SvgText>
          <Circle cx={hi.x} cy={hi.y} r="12" fill="#4AABEE" fillOpacity="0.25" />
          <Circle cx={hi.x} cy={hi.y} r="6.5" fill="#FFFFFF" stroke="#4AABEE" strokeWidth="3" />
          <SvgText fontFamily={SVG_FONT} x={L} y={H - 6} fontSize="11" fill="#7F97B8">{series.first}</SvgText>
          <SvgText fontFamily={SVG_FONT} x={R} y={H - 6} textAnchor="end" fontSize="11" fill="#7F97B8">{series.last}</SvgText>
        </Svg>
      ) : <View style={{ height: 110 }} />}
    </View>
  )
}

/** Short vertical glowing connector between the three parts. Decorative. */
function Connector() {
  return (
    <View style={styles.connector} aria-hidden importantForAccessibility="no-hide-descendants">
      <Svg width={24} height={28} viewBox="0 0 24 28">
        <Line x1="12" y1="0" x2="12" y2="28" stroke="#4AABEE" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
        <Line x1="12" y1="0" x2="12" y2="28" stroke="#9AD4FF" strokeWidth="2.5" strokeDasharray="3 4" strokeLinecap="round" />
      </Svg>
    </View>
  )
}

/** One tip: expenditure pattern → data insight → Kate's recommendation (same flow as the web, kate-flow.html style). */
function Tip({ signal, customer, actions }) {
  const [why, setWhy] = useState(false)
  const visual = tipVisual(signal, customer)
  const device = Boolean(signal.itemKey)
  const open = () => (device
    ? actions.reportDefect(signal.itemKey, PREVENTIVE_ISSUE, true)
    : actions.navigate('product', { productId: signal.productId, signalId: signal.id, categoryId: null }))
  const cta = device ? 'Schedule replacement' : 'View offer'
  const reasons = signal.reasons ?? []

  return (
    <View style={styles.card}>
      <LinearGradient colors={['#14407F', '#0B2A5B', '#061633']} locations={[0, 0.45, 1]} start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 1 }}
        style={StyleSheet.absoluteFill} pointerEvents="none" />
      <T style={styles.sr} accessibilityLabel={visual.summary}>{visual.summary}</T>
      <View aria-hidden importantForAccessibility="no-hide-descendants">
        <T style={styles.step}>EXPENDITURE PATTERN</T>
        <Sparkline visual={visual} />
      </View>
      <Connector />
      <View style={styles.insightWrap} aria-hidden importantForAccessibility="no-hide-descendants">
        <T style={[styles.step, styles.center]}>DATA INSIGHT</T>
        <View style={styles.pill}>
          <View style={styles.pillDot} />
          <T style={styles.pillText}>{visual.insight}</T>
        </View>
      </View>
      <Connector />
      <View style={styles.kate}>
        <View style={styles.kateHead}>
          <View style={styles.kateAvatar} aria-hidden><T style={styles.kateK}>K</T></View>
          <T style={styles.kateName}>Kate</T>
        </View>
        <T style={styles.line}>{visual.line}</T>
        {visual.price ? <View style={styles.price}><T style={styles.priceText}>{visual.price}</T></View> : null}
        {why && reasons.length ? (
          <View style={styles.reasons} role="list">
            {reasons.map((r) => (
              <View key={r} style={styles.reason} role="listitem">
                <View style={styles.bullet} aria-hidden />
                <T style={styles.reasonText}>{r}</T>
              </View>
            ))}
          </View>
        ) : null}
        <View style={styles.actions}>
          <Press onPress={open} style={styles.cta} label={`${cta}: ${visual.line}`}>
            <T style={styles.ctaText}>{cta}</T>
          </Press>
          {reasons.length ? (
            <Press onPress={() => setWhy((v) => !v)} style={styles.link} label={why ? 'Hide why Kate suggests this' : 'Why does Kate suggest this?'}
              aria-expanded={why}>
              <T style={styles.linkText}>{why ? 'Hide' : 'Why?'}</T>
            </Press>
          ) : null}
          <Press onPress={() => actions.dismissSignal(signal.id)} style={styles.link} label={`Dismiss tip: ${titleOf(signal)}`}>
            <T style={styles.linkText}>Dismiss</T>
          </Press>
        </View>
      </View>
    </View>
  )
}

/** "Kate level: Proactive ›" — opens the data choices. */
function LevelChip({ level, actions }) {
  const label = KATE_LEVELS.find((l) => l.id === level)?.label
  return (
    <Press onPress={() => actions.navigate('consent')} style={styles.chip} label={`Kate level: ${label}. Change your data choices`} hitSlop={6}>
      <T style={styles.chipText} numberOfLines={1}>Kate level: {label}</T>
      <Icon name="chevron" size={14} color={colors.kmBlue} />
    </Press>
  )
}

export function KateTips({ signals, customer, actions, kateLevel }) {
  const level = kateLevelOf(kateLevel)
  const list = level === 'basic' ? [] : signals ?? []
  return (
    <View style={styles.section}>
      <SectionHeader title="Tips from Kate" leading={<KateAvatar size={26} />} right={<LevelChip level={level} actions={actions} />} />
      {level === 'basic'
        ? <T style={styles.empty}>{KATE_LEVELS[0].line}</T>
        : list.length === 0
          ? <T style={styles.empty}>No new tips. Kate lets you know when something can save you money.</T>
          : list.map((s) => <Tip key={s.id} signal={s} customer={customer} actions={actions} />)}
    </View>
  )
}

const styles = StyleSheet.create({
  section: { marginTop: space.xl },
  card: { marginBottom: space.md, borderRadius: 24, padding: space.lg, overflow: 'hidden', backgroundColor: '#0B2A5B' },
  sr: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  step: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: '#4AABEE', marginBottom: space.xs },
  center: { textAlign: 'center' },
  connector: { alignItems: 'center', marginVertical: 2 },
  insightWrap: { alignItems: 'center' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: 10, paddingHorizontal: space.md, borderRadius: 18,
    backgroundColor: 'rgba(74, 171, 238, 0.16)', borderWidth: 1.5, borderColor: '#4AABEE' },
  pillDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4AABEE' },
  pillText: { ...font.caption, fontWeight: '600', color: '#FFFFFF' },
  kate: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: space.lg, gap: space.sm },
  kateHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  kateAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#0A64B8', alignItems: 'center', justifyContent: 'center' },
  kateK: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  kateName: { ...font.label, fontWeight: '700', color: '#0B2A5B' },
  line: { ...font.body, color: '#33445C', lineHeight: 21 },
  price: { alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: space.md, borderRadius: radius.pill, backgroundColor: '#EAF2FB' },
  priceText: { ...font.caption, fontWeight: '700', color: '#0A64B8', ...tabular },
  reasons: { marginTop: space.md, gap: space.sm },
  reason: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  bullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.kmBlue, marginTop: 7 },
  reasonText: { ...font.caption, flex: 1, color: colors.kmNavy, lineHeight: 19 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: space.xs, marginTop: space.xs },
  cta: { minHeight: TAP - 8, justifyContent: 'center', paddingHorizontal: space.lg, borderRadius: radius.pill, backgroundColor: '#0A64B8' },
  ctaText: { ...font.caption, fontWeight: '700', color: '#fff' },
  link: { minHeight: TAP, minWidth: TAP, justifyContent: 'center', alignItems: 'center', paddingHorizontal: space.sm },
  linkText: { ...font.caption, fontWeight: '600', color: colors.kmBlue },
  empty: { ...font.caption, color: colors.kmSub },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 32, paddingLeft: space.md, paddingRight: space.sm, borderRadius: radius.pill, backgroundColor: colors.kmSky },
  chipText: { ...font.caption, fontWeight: '600', color: colors.kmBlue },
})
