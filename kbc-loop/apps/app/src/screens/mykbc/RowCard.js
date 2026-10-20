// White row card as in My KBC: icon on the left, name + subtext, amount or chevron on the right.
// With onPress the card is tappable (KBC Loop); non-Loop cards are wrapped in <Dimmed> by their section.
import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Amount } from '../../ui/Amount.js'
import { Icon } from '../../ui/Icon.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { LineIcon } from './icons.js'
import { cardShadow, colors } from '../../theme.js'

const OUTLINE_ICONS = ['house', 'home', 'doc', 'chart', 'shield', 'trustbox']
const GRADIENTS = { coins: ['#0a3970', '#0d2a55'], loop: ['#2fd3b8', '#0b8fc4'], card: ['#1d5fa8', '#0a3d7a'], default: ['#50c8f4', '#1aa8e6'] }

export function RowIcon({ icon }) {
  if (OUTLINE_ICONS.includes(icon)) {
    return <View style={[styles.icon, styles.iconOutline]}><LineIcon name={icon} size={24} color={colors.kmBlue} /></View>
  }
  return (
    <LinearGradient colors={GRADIENTS[icon] ?? GRADIENTS.default} start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 1 }} style={styles.icon}>
      <View style={styles.facet} />
      {icon === 'coins'
        ? <View style={styles.coinMini}><T style={styles.coinK}>K</T></View>
        : <LineIcon name={icon} size={24} color="#fff" />}
    </LinearGradient>
  )
}

export function RowCard({ icon, name, sub, sub2, value, unit, onPress, label }) {
  const body = (
    <>
      <RowIcon icon={icon} />
      <View style={styles.text}>
        <T style={styles.name} numberOfLines={1}>{name}</T>
        {sub ? <T style={styles.sub} numberOfLines={2}>{sub}</T> : null}
        {sub2 ? <T style={styles.sub2}>{sub2}</T> : null}
      </View>
      {value !== undefined
        ? <Amount value={value} unit={unit} style={styles.amount} />
        : onPress ? <Icon name="chevron" size={18} /> : null}
      {value !== undefined && onPress ? <Icon name="chevron" size={18} /> : null}
    </>
  )
  if (onPress) return <Press style={styles.card} onPress={onPress} label={label ?? name}>{body}</Press>
  return <View style={styles.card}>{body}</View>
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12, ...cardShadow },
  icon: { width: 46, height: 46, borderRadius: 8, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  iconOutline: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#cfe2f3' },
  facet: { position: 'absolute', left: -14, top: -20, width: 40, height: 60, backgroundColor: 'rgba(255,255,255,0.16)', transform: [{ rotate: '35deg' }] },
  coinMini: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  coinK: { color: '#fff', fontWeight: '900', fontSize: 14 },
  text: { flex: 1, minWidth: 0 },
  name: { fontSize: 16 },
  sub: { color: colors.kmNavy, fontSize: 14, marginTop: 1 },
  sub2: { color: colors.kmSub, fontSize: 12, marginTop: 3 },
  amount: { fontSize: 18 },
})
