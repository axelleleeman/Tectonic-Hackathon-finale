// "Share my impact": a button that opens a modal with a navy impact card and the native Share sheet
// (React Native's Share API with a text summary; no extra native dependencies).
import { useState } from 'react'
import { Modal, Share, StyleSheet, View } from 'react-native'
import { num } from '@kbc-loop/shared/engine/format.js'
import { TODAY } from '@kbc-loop/shared/config/index.js'
import { Icon } from '../../ui/Icon.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { colors } from '../../theme.js'

const YEAR = TODAY.slice(0, 4)
const NAVY = '#0C2340'
const INK = '#EEF3FA'
const MUTED = '#A3B5CF'
const ECO = '#4CCB93'

export const impactSummary = ({ totals, coins }) =>
  `My KBC LOOP impact in ${YEAR}: ${num(totals.co2Kg)} kg CO₂ saved (≈ ${num(totals.carKm)} km less by car), `
  + `${num(totals.active)} products in use and ${num(coins)} Kate Coins earned. Borrow instead of buy.`

function Figure({ label, value, unit, color = INK }) {
  return (
    <View style={styles.fig}>
      <T style={styles.figLabel}>{label}</T>
      <T style={[styles.figValue, { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}{unit ? <T style={[styles.figUnit, { color }]}> {unit}</T> : null}
      </T>
    </View>
  )
}

export function ImpactCard({ name, totals, coins }) {
  return (
    <View style={styles.card} accessible accessibilityLabel={impactSummary({ totals, coins })}>
      <View style={styles.brand}>
        <Icon name="loop" size={22} color="#4AABEE" />
        <T style={styles.wordmark}>KBC LOOP</T>
      </View>
      <T style={styles.title}>My impact</T>
      <T style={styles.meta}>{name ? `${name} · ` : ''}{YEAR}</T>
      <Figure label="CO₂ saved" value={num(totals.co2Kg)} unit="kg" color={ECO} />
      <T style={styles.meta}>≈ {num(totals.carKm)} km less driving by car</T>
      <View style={styles.rule} />
      <View style={styles.row}>
        <Figure label="Kate Coins" value={num(coins)} />
        <Figure label="Products in use" value={num(totals.active)} />
      </View>
    </View>
  )
}

export function ShareImpact({ name, totals, coins }) {
  const [open, setOpen] = useState(false)
  const share = async () => {
    try { await Share.share({ message: impactSummary({ totals, coins }), title: 'My KBC LOOP impact' }) } catch { /* dismissed or unavailable */ }
  }
  return (
    <>
      <Press onPress={() => setOpen(true)} label="Share my impact" style={styles.open}>
        <Icon name="arrowUp" size={18} color={colors.button} />
        <T style={styles.openText}>Share my impact</T>
      </Press>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.scrim}>
          <View style={styles.sheet}>
            <ImpactCard name={name} totals={totals} coins={coins} />
            <Press onPress={share} label="Share" style={styles.primary}><T style={styles.primaryText}>Share</T></Press>
            <Press onPress={() => setOpen(false)} label="Close" style={styles.close}><T style={styles.closeText}>Close</T></Press>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  open: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12,
    borderRadius: 99, borderWidth: 1.5, borderColor: colors.button, backgroundColor: '#fff',
  },
  openText: { color: colors.button, fontWeight: '600', fontSize: 15 },
  scrim: { flex: 1, backgroundColor: 'rgba(12, 35, 64, 0.55)', justifyContent: 'center', padding: 20 },
  sheet: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  card: { backgroundColor: NAVY, borderRadius: 20, padding: 24, gap: 6 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 },
  wordmark: { color: INK, fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
  title: { color: INK, fontSize: 26, fontWeight: '700' },
  meta: { color: MUTED, fontSize: 14 },
  fig: { flex: 1, marginTop: 16 },
  figLabel: { color: MUTED, fontSize: 13, fontWeight: '600' },
  figValue: { fontSize: 40, fontWeight: '700', letterSpacing: -1 },
  figUnit: { fontSize: 18, fontWeight: '600' },
  rule: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)', marginTop: 16 },
  row: { flexDirection: 'row', gap: 12 },
  primary: { backgroundColor: colors.button, paddingVertical: 14, borderRadius: 99, marginTop: 16, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  close: { paddingVertical: 12, alignItems: 'center' },
  closeText: { color: '#fff', fontSize: 15, fontWeight: '600' },
})
