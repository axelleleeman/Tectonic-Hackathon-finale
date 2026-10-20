// KBC Mobile promo cards: "Kate suggests…", Kate Coins banner, Group expenses and My Trustbox.
// None of them is KBC Loop, so Home shows them dimmed; illustrations are neutral gradients with generic icons.
import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Circle } from 'react-native-svg'
import { num } from '@kbc-loop/shared/engine/format.js'
import { T } from '../../ui/T.js'
import { Glyph } from './icons.js'
import { Dots, Pill, RADIUS, Section, shared } from './parts.js'
import { colors } from '../../theme.js'

const RING = 92

/** Round illustration with a blue progress ring, as in "Kate suggests". */
function DreamRing() {
  const r = RING / 2 - 3
  const c = 2 * Math.PI * r
  return (
    <View style={styles.ringWrap} aria-hidden>
      <LinearGradient colors={['#ffd88a', '#7cc3e8', '#2f6f9c']} style={styles.ringFill}>
        <Glyph name="star" size={34} color="#fff" strokeWidth={1.6} />
      </LinearGradient>
      <Svg width={RING} height={RING} style={StyleSheet.absoluteFill}>
        <Circle cx={RING / 2} cy={RING / 2} r={r} stroke={colors.kmBlue} strokeWidth={3} fill="none"
          strokeDasharray={`${c * 0.7} ${c}`} strokeLinecap="round" transform={`rotate(-80 ${RING / 2} ${RING / 2})`} />
      </Svg>
    </View>
  )
}

export function KateSuggests() {
  return (
    <View style={[shared.card, styles.suggest]}>
      <View style={styles.suggestBg} />
      <View style={styles.suggestText}>
        <T style={styles.suggestTitle}>Kate suggests: a new, fun way to save for your dreams.</T>
        <Pill label="What do you dream of?" style={styles.suggestPill} />
      </View>
      <DreamRing />
      <View style={styles.suggestDots}><Dots /></View>
    </View>
  )
}

export function KateCoinsBanner({ coins }) {
  return (
    <Section title="Kate Coins" link="See more">
      <LinearGradient colors={['#dff1fb', '#b9e2f6', '#8fd0f0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
        <View style={styles.bannerArt} aria-hidden>
          <View style={[styles.bubble, styles.bubbleA]}><T style={styles.bubbleK}>K</T></View>
          <View style={[styles.bubble, styles.bubbleB]}><T style={styles.bubbleK}>K</T></View>
          <View style={[styles.bubble, styles.bubbleC]}><T style={styles.bubbleK}>K</T></View>
        </View>
        <View style={styles.bannerText}>
          <T style={styles.bannerTitle}>Collect Kate Coins with every purchase</T>
          <T style={styles.bannerSub}>You now have {num(coins)} Kate Coins</T>
        </View>
      </LinearGradient>
    </Section>
  )
}

/** Card with text on the left and a neutral image area on the right. */
function SplitCard({ children, art, colorsArt }) {
  return (
    <View style={[shared.card, styles.split]}>
      <View style={styles.splitText}>{children}</View>
      <LinearGradient colors={colorsArt} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.splitArt}>
        <Glyph name={art} size={52} color="rgba(255,255,255,0.9)" strokeWidth={1.3} />
        <View style={styles.splitDots}><Dots /></View>
      </LinearGradient>
    </View>
  )
}

export function GroupExpenses() {
  return (
    <Section title="Split group expenses">
      <SplitCard art="people" colorsArt={['#f3c99b', '#c98a6a']}>
        <T style={styles.splitTitle} numberOfLines={1}>Split group expenses</T>
        <T style={styles.splitBody}>Weekend with friends? Travelling together? Keep track of your shared expenses.</T>
        <Pill filled label="See how it works" style={styles.splitPill} />
      </SplitCard>
    </Section>
  )
}

export function Trustbox() {
  return (
    <Section title="My Trustbox">
      <SplitCard art="lock" colorsArt={['#8fa7bd', '#4f6a85']}>
        <View style={styles.trustLogo}>
          <Glyph name="docs" size={24} color={colors.kmBlue} strokeWidth={1.8} />
          <T style={styles.trustName}>my trustbox</T>
        </View>
        <T style={styles.splitBody}>Your documents and data safely in one place.</T>
      </SplitCard>
    </Section>
  )
}

const styles = StyleSheet.create({
  suggest: { marginTop: 16, flexDirection: 'row', alignItems: 'center', padding: 16, overflow: 'hidden', minHeight: 140 },
  suggestBg: { position: 'absolute', right: -60, top: -40, bottom: -40, width: 200, borderRadius: 200, backgroundColor: '#f1f7fc' },
  suggestText: { flex: 1, paddingRight: 12 },
  suggestTitle: { fontSize: 16.5, lineHeight: 23, fontWeight: '500' },
  suggestPill: { marginTop: 14 },
  suggestDots: { position: 'absolute', top: 8, right: 10, backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 2 },
  ringWrap: { width: RING, height: RING, alignItems: 'center', justifyContent: 'center' },
  ringFill: { width: RING - 18, height: RING - 18, borderRadius: RING, alignItems: 'center', justifyContent: 'center' },

  banner: { height: 92, borderRadius: RADIUS, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  bannerArt: { width: 120, height: '100%' },
  bubble: { position: 'absolute', borderRadius: 40, backgroundColor: '#0b3466', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
  bubbleA: { width: 54, height: 54, left: 18, top: 18 },
  bubbleB: { width: 34, height: 34, left: 68, top: 8 },
  bubbleC: { width: 28, height: 28, left: 72, top: 54 },
  bubbleK: { color: '#fff', fontWeight: '900', fontSize: 15 },
  bannerText: { flex: 1, paddingRight: 34 },
  bannerTitle: { fontSize: 16, fontWeight: '800', color: colors.kmNavy, lineHeight: 20 },
  bannerSub: { fontSize: 13, fontWeight: '600', color: colors.kmNavy, marginTop: 4 },

  split: { flexDirection: 'row', overflow: 'hidden', minHeight: 104 },
  splitText: { flex: 1.5, padding: 16, justifyContent: 'center' },
  splitArt: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  splitDots: { position: 'absolute', top: 8, right: 8, backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 2 },
  splitTitle: { fontSize: 18, fontWeight: '700' },
  splitBody: { fontSize: 15, lineHeight: 21, marginTop: 4 },
  splitPill: { marginTop: 12 },
  trustLogo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trustName: { fontSize: 18, fontWeight: '800', color: colors.kmNavy, letterSpacing: -0.3 },
})
