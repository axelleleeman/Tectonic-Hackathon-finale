// Horizontale rij rekeningkaarten: Kate Coins-tab links, zichtrekening (actief), spaarrekening
// en de KBC Loop-kaart van Axelle (klikbaar naar Mijn KBC). Alle bedragen komen van de fictieve klant.
import { ScrollView, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Polygon } from 'react-native-svg'
import { loopTotals } from '@kbc-loop/shared/engine/impact.js'
import { T } from '../../ui/T.js'
import { Press } from '../../ui/Press.js'
import { Amount } from '../../ui/Amount.js'
import { BadgeNew } from '../common.js'
import { Glyph } from './icons.js'
import { GUTTER, shared } from './parts.js'
import { colors } from '../../theme.js'

const CARD_W = 128
const TOP_H = 96
const INFO_H = 70
const TAB_W = 34

const GRADIENTS = {
  blue: ['#43c4f3', '#16a3e4'],
  light: ['#68d0f6', '#2fb3ea'],
  loop: ['#2fd3b8', '#0b8fc4'],
}

/** Blauw vlak met schuine facetten, zoals de kaartbovenkant in KBC Mobile. */
function Facets({ kind }) {
  return (
    <LinearGradient colors={GRADIENTS[kind]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Polygon points="0,0 55,0 0,70" fill="#fff" fillOpacity={0.1} />
        <Polygon points="40,100 100,30 100,100" fill="#fff" fillOpacity={0.12} />
        <Polygon points="55,0 100,0 100,30 70,45" fill="#003a6b" fillOpacity={0.08} />
        <Polygon points="0,70 30,100 0,100" fill="#003a6b" fillOpacity={0.07} />
      </Svg>
    </LinearGradient>
  )
}

function CardBody({ kind, icon, label, value, unit, selected, isNew, editable }) {
  return (
    <>
      <View style={styles.top}>
        <Facets kind={kind} />
        <Glyph name={icon} size={46} color="#fff" strokeWidth={1.4} />
        {editable ? <View style={styles.pencil} aria-hidden><Glyph name="pencil" size={13} color={colors.kmNavy} strokeWidth={1.8} /></View> : null}
        {isNew ? <BadgeNew style={styles.badge} /> : null}
      </View>
      <View style={[styles.info, selected && styles.infoSelected]}>
        <T style={styles.label} numberOfLines={1}>{label}</T>
        <Amount value={value} unit={unit} style={styles.amount} />
      </View>
      {selected ? <View style={styles.underline} /> : null}
    </>
  )
}

function CoinsTab({ coins }) {
  const [int, dec] = Math.abs(coins).toFixed(2).split('.')
  return (
    <LinearGradient colors={['#0e4f8c', '#0b3466']} style={styles.tab} accessibilityLabel={`${int},${dec} Kate Coins`}>
      <View style={styles.tabTextWrap}>
        <T style={styles.tabText} numberOfLines={1}>{int},{dec} KTC</T>
      </View>
      <View style={styles.tabCoin}><T style={styles.tabCoinK}>K</T></View>
    </LinearGradient>
  )
}

export function AccountCarousel({ customer, items, coins, onLoop }) {
  const savings = customer.myKbc.find((r) => r.section === 'Rekeningen')
  const t = loopTotals(items)
  const name = customer.fullName.toUpperCase()
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={shared.bleed} contentContainerStyle={styles.row}>
      <CoinsTab coins={coins} />
      <View style={[styles.card, styles.cardSelected]} accessibilityLabel={`${customer.accountName} ${name}`}>
        <CardBody kind="blue" icon="purse" label={name} value={customer.balance} selected editable />
      </View>
      {savings ? (
        <View style={styles.card} accessibilityLabel={`${savings.name} ${name}`}>
          <CardBody kind="light" icon="piggy" label={name} value={savings.value} editable />
        </View>
      ) : null}
      <Press style={styles.card} onPress={onLoop} label="KBC Loop in Mijn KBC">
        <CardBody kind="loop" icon="loop" label={`KBC LOOP · ${t.active} GELEEND`} value={t.monthly} unit="EUR/m" isNew={t.active === 0} />
      </Press>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  row: { gap: 12, alignItems: 'flex-start', paddingRight: GUTTER, paddingTop: 6, paddingBottom: 18 },
  card: { width: CARD_W, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0px 3px 10px rgba(18, 40, 76, 0.10)' },
  cardSelected: { boxShadow: '0px 6px 16px rgba(18, 40, 76, 0.16)' },
  top: { height: TOP_H, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  pencil: { position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 8, right: 8 },
  info: { height: INFO_H, paddingTop: 12, paddingHorizontal: 8 },
  infoSelected: { height: INFO_H + 8 },
  label: { color: colors.kmSub, fontSize: 13, letterSpacing: 0.2 },
  amount: { marginTop: 3, fontSize: 17, fontWeight: '700' },
  underline: { position: 'absolute', left: 8, right: 8, bottom: 6, height: 4, borderRadius: 2, backgroundColor: colors.kmBlue },
  tab: { width: TAB_W, height: TOP_H + INFO_H, borderTopRightRadius: 8, borderBottomRightRadius: 8, overflow: 'hidden', alignItems: 'center' },
  tabTextWrap: { position: 'absolute', top: 48, left: (TAB_W - 100) / 2, width: 100, alignItems: 'center', transform: [{ rotate: '-90deg' }] },
  tabText: { color: '#fff', fontSize: 13, fontWeight: '700', letterSpacing: 0.4 },
  tabCoin: { position: 'absolute', bottom: 0, width: TAB_W, height: 40, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  tabCoinK: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.kmBlue, color: '#fff', fontSize: 11, fontWeight: '900', textAlign: 'center', lineHeight: 20, overflow: 'hidden' },
})
