// Mijn KBC: rekeningen, kredieten, verzekeringen, Kate Coins en KBC Loop (statistieken + geleende producten).
import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { loopTotals } from '@kbc-loop/shared/engine/impact.js'
import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { serviceById } from '@kbc-loop/shared/engine/integrations.js'
import { Icon } from '../ui/Icon.js'
import { Amount } from '../ui/Amount.js'
import { Stat } from '../ui/Stat.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { LoopItemCard } from './LoopItemCard.js'
import { SectionHead } from './common.js'
import { cardShadow, colors, type } from '../theme.js'

const ICONS = { Rekeningen: 'wallet', Kredieten: 'house', Verzekeringen: 'home' }
const OUTLINE_ICONS = ['house', 'home', 'doc', 'chart']
const GRADIENTS = { coins: ['#0a3970', '#0d2a55'], loop: ['#2fd3b8', '#0b8fc4'], default: ['#50c8f4', '#1aa8e6'] }

function NewLink({ onPress }) {
  return (
    <Press style={styles.newLink} onPress={onPress} focusable={Boolean(onPress)}>
      <View style={styles.plus}><Icon name="plus" size={14} color="#fff" /></View>
      <T style={styles.newText}>Nieuw</T>
    </Press>
  )
}

function RowIcon({ icon }) {
  if (OUTLINE_ICONS.includes(icon)) {
    return <View style={[styles.rowIcon, styles.rowIconOutline]}><Icon name={icon} size={24} color={colors.kmBlue} /></View>
  }
  return (
    <LinearGradient colors={GRADIENTS[icon] ?? GRADIENTS.default} start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 1 }} style={styles.rowIcon}>
      {icon === 'coins'
        ? <View style={styles.coinMini}><T style={styles.coinK}>K</T></View>
        : <Icon name={icon} size={24} color="#fff" />}
    </LinearGradient>
  )
}

function Row({ icon, name, sub, value, unit, onPress }) {
  return (
    <Press style={styles.rowCard} onPress={onPress} focusable={Boolean(onPress)}>
      <RowIcon icon={icon} />
      <View style={styles.rowText}>
        <T style={styles.rowName} numberOfLines={1}>{name}</T>
        <T style={styles.rowSub}>{sub}</T>
      </View>
      {value !== undefined ? <Amount value={value} unit={unit} style={styles.rowAmount} /> : <Icon name="chevron" size={18} />}
    </Press>
  )
}

export function MyKbc({ customer, items, coins, actions }) {
  const rows = [
    { section: 'Rekeningen', name: customer.fullName.toUpperCase(), sub: customer.iban, value: customer.balance, icon: 'wallet' },
    ...customer.myKbc.map((r) => (r.section === 'Rekeningen'
      ? { ...r, name: customer.fullName.toUpperCase(), icon: /spaar/i.test(r.name) ? 'piggy' : 'wallet' }
      : r)),
  ]
  const sections = [...new Set(rows.map((r) => r.section))]
  const t = loopTotals(items)
  const impact = serviceById(customer.type === 'kmo' ? 'kubeEsg' : 'ecoWise')

  return (
    <>
      {sections.map((title) => (
        <View key={title}>
          <SectionHead title={title} right={<NewLink />} />
          {rows.filter((r) => r.section === title).map((r) => (
            <Row key={r.name + r.sub} icon={r.icon ?? ICONS[title] ?? 'doc'} name={r.name} sub={r.sub} value={r.value} />
          ))}
        </View>
      ))}

      <SectionHead title="Kate Coins" />
      <Row icon="coins" name="Kate Coins" sub="Verdiend met herstellen en inleveren" value={coins} unit="KTC" />

      <SectionHead title="KBC Loop" right={<NewLink onPress={() => actions.navigate('shop')} />} />
      <View style={styles.tiles}>
        <Stat value={t.active} label="in gebruik" />
        <Stat value={t.repairs} label="keer hersteld i.p.v. weggegooid" />
        <Stat value={`${num(t.co2Kg)} kg`} label="CO₂ vermeden" hint={t.co2Kg ? `≈ ${num(t.carKm)} km auto` : null} />
      </View>
      {items.length === 0 ? (
        <Row icon="loop" name="Je leent nog niets" sub="Ontdek de circulaire partners" onPress={() => actions.navigate('shop')} />
      ) : null}
      {items.map((i) => <LoopItemCard key={i.key} item={i} actions={actions} />)}
      {t.active > 0 ? <T style={type.fine}>Totaal {euro(t.monthly)}/maand, incl. onderhoud, herstel en verzekering.</T> : null}
      <Row icon="chart" name={`Je impact in ${impact.name}`} sub={impact.label} />
    </>
  )
}

const styles = StyleSheet.create({
  newLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  plus: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.kmGreen, alignItems: 'center', justifyContent: 'center' },
  newText: { fontSize: 15 },
  rowCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 10, ...cardShadow },
  rowIcon: { width: 46, height: 46, borderRadius: 8, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  rowIconOutline: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#cfe2f3' },
  coinMini: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  coinK: { color: '#fff', fontWeight: '900', fontSize: 14 },
  rowText: { flex: 1, minWidth: 0 },
  rowName: { fontSize: 15, fontWeight: '600' },
  rowSub: { color: colors.kmSub, fontSize: 13 },
  rowAmount: { fontSize: 16 },
  tiles: { flexDirection: 'row', gap: 8, marginVertical: 10 },
})
