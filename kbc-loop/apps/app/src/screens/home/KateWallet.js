// "Kate Wallet": blue promo card with a simple illustration and card tiles (generic icons, no brands).
// Not part of KBC Loop: Home shows it dimmed.
import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path, Rect } from 'react-native-svg'
import { T } from '../../ui/T.js'
import { Glyph } from './icons.js'
import { Dots, Pill, RADIUS, Section } from './parts.js'
import { colors } from '../../theme.js'

const TILES = ['star', 'store', 'basket', 'ticket']

function PhoneArt() {
  return (
    <Svg width={110} height={110} viewBox="0 0 110 110" aria-hidden>
      <Path d="M30 108c-8-14-10-30-4-44l14-30c3-6 10-4 9 2l-4 20 40-6c7-1 9 8 3 10l-8 3c6 1 6 9 0 10 5 2 4 9-2 10 4 3 2 9-4 9H60" fill="#fff" stroke="#12284c" strokeWidth={1.6} strokeLinejoin="round" />
      <Rect x={36} y={6} width={50} height={84} rx={8} fill="#eaf6fd" stroke="#12284c" strokeWidth={1.6} transform="rotate(-12 61 48)" />
      <Rect x={38} y={22} width={46} height={26} rx={4} fill="#1a9ad6" stroke="#12284c" strokeWidth={1.2} transform="rotate(-12 61 35)" />
      <Rect x={44} y={56} width={14} height={12} rx={2} fill="#fff" stroke="#12284c" strokeWidth={1.2} transform="rotate(-12 51 62)" />
      <Rect x={62} y={52} width={14} height={12} rx={2} fill="#fff" stroke="#12284c" strokeWidth={1.2} transform="rotate(-12 69 58)" />
      <Rect x={47} y={72} width={14} height={12} rx={2} fill="#fff" stroke="#12284c" strokeWidth={1.2} transform="rotate(-12 54 78)" />
      <Rect x={65} y={68} width={14} height={12} rx={2} fill="#fff" stroke="#12284c" strokeWidth={1.2} transform="rotate(-12 72 74)" />
    </Svg>
  )
}

export function KateWallet() {
  return (
    <Section title="Kate Wallet" link="Open Kate Wallet">
      <LinearGradient colors={['#0d5793', '#2b8fcf', '#4aa9de']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.art}><PhoneArt /></View>
        <Dots color="#fff" style={styles.dots} />
        <T style={styles.title}>Kate Wallet</T>
        <T style={styles.text}>Keep your payment and loyalty cards in one place so you can use them quickly anywhere.</T>
        <Pill label="Open Kate Wallet" color="#fff" style={styles.pill} />
        <View style={styles.tiles}>
          {TILES.map((t) => (
            <View key={t} style={styles.tile}>
              <Glyph name={t} size={30} color={colors.kmBlue} strokeWidth={1.6} />
              <View style={styles.plus}><Glyph name="plus" size={12} color="#fff" strokeWidth={3} /></View>
            </View>
          ))}
        </View>
      </LinearGradient>
    </Section>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: RADIUS, padding: 16, paddingBottom: 16, overflow: 'hidden' },
  art: { position: 'absolute', right: 2, top: 34 },
  dots: { position: 'absolute', top: 10, right: 14 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 4 },
  text: { color: '#fff', fontSize: 14.5, lineHeight: 20, marginTop: 4, marginRight: 110 },
  pill: { marginTop: 14 },
  tiles: { flexDirection: 'row', gap: 12, marginTop: 16, marginRight: -40 },
  tile: { width: 96, height: 72, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  plus: { position: 'absolute', top: 7, right: 7, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.kmGreen, alignItems: 'center', justifyContent: 'center' },
})
