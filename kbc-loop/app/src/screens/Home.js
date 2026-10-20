// Start: My-knoppen, rekeningkaarten, betalingen, "Voor jou" (Kate-tips) en extra diensten.
import { ScrollView, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { PREVENTIVE_ISSUE } from '@kbc-loop/shared/data/index.js'
import { loopTotals } from '@kbc-loop/shared/engine/impact.js'
import { Icon } from '../ui/Icon.js'
import { Amount } from '../ui/Amount.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { KateMark } from '../phone/AppBar.js'
import { BadgeNew, HeadLink, SectionHead } from './common.js'
import { cardShadow, colors } from '../theme.js'

const shortDate = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

// "My…"-knoppen van KBC Mobile; MyLoop is nieuw.
const MY_CHIPS = [
  { id: 'loop', label: 'MyLoop', icon: 'loop', isNew: true },
  { id: 'nws', label: 'MyNWS', icon: 'news' },
  { id: 'home', label: 'MyHome', icon: 'house' },
  { id: 'mobility', label: 'MyMobility', icon: 'signpost' },
]

// Extra diensten: KBC Loop staat tussen bestaande diensten.
const EXTRA = [
  { id: 'loop', title: 'KBC Loop', sub: 'Lenen in plaats van kopen', icon: 'loop', isNew: true },
  { id: 'energy', title: 'Energie-inzichten', sub: 'Inzicht krijgen in je energieverbruik', icon: 'chart' },
  { id: 'bike', title: 'Deelfiets', sub: 'Een fiets huren voor een dag', icon: 'signpost' },
]

const VISUALS = {
  coins: ['#0a3970', '#0d2a55'],
  blue: ['#42c3f2', '#12a6e6'],
  light: ['#6fd2f7', '#2db5ec'],
  loop: ['#2fd3b8', '#0b8fc4'],
}

function Visual({ kind, children }) {
  return (
    <LinearGradient colors={VISUALS[kind]} start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 1 }} style={styles.visual}>
      {kind !== 'coins' ? <View style={styles.stripe} /> : null}
      {children}
    </LinearGradient>
  )
}

function AccountCard({ kind, label, value, unit, selected, onPress, icon }) {
  return (
    <Press style={styles.accCard} onPress={onPress} focusable={Boolean(onPress)}>
      <Visual kind={kind}>
        {icon ? <Icon name={icon} size={40} color="#fff" /> : <View style={styles.coinMark}><T style={styles.coinK}>K</T></View>}
      </Visual>
      <View style={styles.accInfo}>
        <T style={styles.accLabel} numberOfLines={1}>{label}</T>
        <Amount value={value} unit={unit} style={styles.accAmount} />
      </View>
      {selected ? <View style={styles.selected} /> : null}
    </Press>
  )
}

function AccountCards({ customer, items, coins, onLoop }) {
  const savings = customer.myKbc.find((r) => r.section === 'Rekeningen')
  const t = loopTotals(items)
  const name = customer.fullName.toUpperCase()
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.accCards}>
      <AccountCard kind="coins" label="Kate Coins" value={coins} unit="KTC" />
      <AccountCard kind="blue" icon="wallet" label={name} value={customer.balance} selected />
      {savings ? <AccountCard kind="light" icon="piggy" label={name} value={savings.value} /> : null}
      <AccountCard kind="loop" icon="loop" label={`KBC LOOP · ${t.active} GELEEND`} value={t.monthly} unit="EUR/m" onPress={onLoop} />
    </ScrollView>
  )
}

function Tip({ icon, title, text, link, onLink, onClose, isNew, device }) {
  return (
    <View style={[styles.tip, device && styles.tipDevice]}>
      {isNew ? <View style={styles.newDot} /> : null}
      <View style={styles.tipIcon}><Icon name={icon} size={22} /></View>
      <View style={styles.tipBody}>
        <View style={styles.tipTitle}><KateMark size={10} /><T style={styles.tipTitleText}>{title}</T></View>
        <T style={styles.tipText}>{text}</T>
        {link ? <Press onPress={onLink}><T style={styles.tipLink}>{link}</T></Press> : null}
      </View>
      {onClose ? (
        <Press style={styles.tipX} onPress={onClose} label="Niet interessant"><Icon name="close" size={11} color="#6b7a8c" /></Press>
      ) : null}
    </View>
  )
}

export function Home({ customer, signals, consent, items, coins, actions }) {
  const hotIds = signals.map((s) => s.triggeredBy.id)
  const openSignal = (s) => (s.itemKey
    ? actions.reportDefect(s.itemKey, PREVENTIVE_ISSUE, true)
    : actions.navigate('product', { productId: s.productId, signalId: s.id, categoryId: null }))

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.bleed, styles.myChipsWrap]} contentContainerStyle={styles.myChips}>
        <View style={styles.myWallet}><Icon name="wallet" size={18} color="#fff" /></View>
        {MY_CHIPS.map((c) => (
          <Press key={c.id} style={[styles.myChip, c.isNew && styles.myChipNew]}
            onPress={c.id === 'loop' ? () => actions.navigate('shop') : undefined}>
            <Icon name={c.icon} size={16} color={c.isNew ? colors.kmBlue : colors.kmNavy} />
            <T style={[styles.myChipText, c.isNew && styles.myChipTextNew]}>{c.label}</T>
          </Press>
        ))}
      </ScrollView>

      <AccountCards customer={customer} items={items} coins={coins} onLoop={() => actions.navigate('mykbc')} />

      <View style={styles.txList}>
        {customer.transactions.slice(0, 3).map((t) => (
          <View key={t.id} style={[styles.tx, hotIds.includes(t.id) && styles.txHot]}>
            <T style={styles.txDate}>{shortDate(t.date)}</T>
            <T style={styles.txMerchant} numberOfLines={1}>{t.merchant.toUpperCase()}</T>
            <Amount value={t.amount} style={styles.txAmount} />
          </View>
        ))}
      </View>
      <View style={styles.txToggle}><Icon name="up" size={14} color={colors.kmBlue} /><T style={styles.txToggleText}>Verberg betalingen</T></View>

      <SectionHead title="Voor jou" right={<HeadLink>Alle communicatie</HeadLink>} />
      {signals.map((s) => {
        const device = s.source === 'toestel'
        return (
          <Tip key={s.id} isNew device={device} icon={device ? 'sensor' : 'loop'}
            title={device ? 'Je lamp laat je weten' : 'Kate tip'} text={s.headline}
            link={s.itemKey ? 'Plan gratis vervanging' : 'Bekijk voorstel'} onLink={() => openSignal(s)}
            onClose={device ? null : () => actions.dismissSignal(s.id)} />
        )
      })}
      <Tip icon="doc" title="Kate laat je weten"
        text={consent ? 'Nieuw in KBC Mobile: MyLoop. Leen in plaats van te kopen, herstel inbegrepen.' : 'Persoonlijke tips staan uit. Kate gebruikt je verrichtingen niet voor voorstellen.'}
        link={consent ? 'Ontdek MyLoop' : null} onLink={() => actions.navigate('shop')} />

      <SectionHead title="Extra diensten" right={<HeadLink>Bekijk meer</HeadLink>} />
      <View style={styles.extraCard}>
        <T style={styles.extraTitle}>Onze andere extra diensten</T>
        {EXTRA.map((e) => (
          <Press key={e.id} style={styles.extraRow} onPress={e.id === 'loop' ? () => actions.navigate('shop') : undefined}>
            <View style={styles.extraIcon}><Icon name={e.icon} size={22} color={colors.kmBlue} /></View>
            <View style={styles.extraText}>
              <View style={styles.extraNameRow}>
                <T style={styles.extraName}>{e.title}</T>
                {e.isNew ? <BadgeNew style={styles.extraBadge} /> : null}
              </View>
              <T style={styles.extraSub} numberOfLines={1}>{e.sub}</T>
            </View>
            <Icon name="heart" size={22} color={colors.kmBlue} />
          </Press>
        ))}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  bleed: { marginHorizontal: -16, flexGrow: 0 },
  myChipsWrap: { marginBottom: 16 },
  myChips: { gap: 8, alignItems: 'center', paddingHorizontal: 16, paddingVertical: 2 },
  myWallet: { width: 46, height: 36, borderRadius: 99, backgroundColor: colors.kmNavy, alignItems: 'center', justifyContent: 'center' },
  myChip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 14, borderRadius: 99, backgroundColor: colors.kmSky },
  myChipNew: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: colors.kmBlue },
  myChipText: { fontSize: 14 },
  myChipTextNew: { fontWeight: '700', color: colors.kmBlue },

  accCards: { gap: 12, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 14 },
  accCard: { width: 136, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0px 3px 12px rgba(18, 40, 76, 0.1)' },
  visual: { height: 96, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  stripe: { position: 'absolute', width: 80, height: 220, left: -10, top: -60, backgroundColor: 'rgba(255,255,255,0.16)', transform: [{ rotate: '45deg' }] },
  coinMark: { width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  coinK: { color: '#fff', fontWeight: '900', fontSize: 24 },
  accInfo: { paddingTop: 10, paddingHorizontal: 10, paddingBottom: 16 },
  accLabel: { color: colors.kmSub, fontSize: 11.5 },
  accAmount: { fontSize: 16, fontWeight: '700' },
  selected: { position: 'absolute', left: 10, right: 10, bottom: 6, height: 4, borderRadius: 2, backgroundColor: colors.kmBlue },

  txList: { marginTop: 6 },
  tx: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 9, paddingHorizontal: 8, borderRadius: 8 },
  txHot: { backgroundColor: '#e3f3fb' },
  txDate: { width: 44, color: colors.kmGrey, fontSize: 12 },
  txMerchant: { flex: 1, fontSize: 14 },
  txAmount: { fontSize: 14 },
  txToggle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, marginLeft: 8 },
  txToggleText: { color: colors.kmBlue, fontSize: 13, fontWeight: '700' },

  tip: { flexDirection: 'row', gap: 14, backgroundColor: '#fff', borderRadius: 10, paddingTop: 16, paddingHorizontal: 16, paddingBottom: 14, marginBottom: 12, ...cardShadow },
  tipDevice: { borderWidth: 1.5, borderColor: '#ffcf4d' },
  newDot: { position: 'absolute', top: -3, left: -3, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.kmRed },
  tipIcon: { width: 36, alignItems: 'center', paddingTop: 2 },
  tipBody: { flex: 1, paddingRight: 18 },
  tipTitle: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tipTitleText: { fontSize: 14, fontWeight: '700' },
  tipText: { marginTop: 4, marginBottom: 8, fontSize: 15, lineHeight: 22 },
  tipLink: { color: colors.kmBlue, fontWeight: '700', fontSize: 14 },
  tipX: { position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: 11, backgroundColor: '#eef3f8', alignItems: 'center', justifyContent: 'center' },

  extraCard: { backgroundColor: '#fff', borderRadius: 12, paddingTop: 16, paddingHorizontal: 14, paddingBottom: 8, ...cardShadow },
  extraTitle: { marginBottom: 10, fontSize: 16, fontWeight: '600' },
  extraRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  extraIcon: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 2px 8px rgba(18, 40, 76, 0.12)' },
  extraText: { flex: 1, minWidth: 0 },
  extraNameRow: { flexDirection: 'row', alignItems: 'center' },
  extraName: { fontSize: 16, fontWeight: '600' },
  extraBadge: { marginLeft: 6 },
  extraSub: { color: '#6b7a8c', fontSize: 13 },
})
