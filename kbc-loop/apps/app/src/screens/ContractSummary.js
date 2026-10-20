// Contract summary card for the borrow flow (before confirming) and the confirmation screen (with Share).
import { Share, StyleSheet, View } from 'react-native'
import { money } from './item/format.js'
import { LinkButton } from '../ui/Button.js'
import { T } from '../ui/T.js'
import { cardShadow, colors } from '../theme.js'

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <T style={styles.label}>{label}</T>
      <T style={styles.value}>{value}</T>
    </View>
  )
}

export function ContractSummary({ terms, partnerName }) {
  return (
    <View style={styles.card}>
      <T style={styles.title}>{terms.product}</T>
      <Row label="Monthly fee" value={money(terms.monthly)} />
      <Row label="Term" value={terms.term} />
      <Row label="Start date" value={terms.start} />
      <Row label="Owner and repairer" value={partnerName} />
      <T style={styles.section}>Included</T>
      {terms.included.map((x) => <T key={x} style={styles.item}>✓  {x}</T>)}
      <T style={styles.section}>Insurance</T>
      <T style={styles.item}>{terms.insurance}</T>
      <T style={styles.section}>Cancellation</T>
      <T style={styles.item}>{terms.cancellation}</T>
    </View>
  )
}

/** Shares a plain-text copy of the contract summary through the system share sheet. */
export function ShareContract({ terms, partnerName }) {
  const share = () => Share.share({
    title: 'KBC Loop contract',
    message: [
      `KBC Loop contract ${terms.reference}`,
      `${terms.product} · ${partnerName}`,
      `${money(terms.monthly)} / month · ${terms.term} · from ${terms.start}`,
      terms.insurance,
      terms.cancellation,
    ].join('\n'),
  }).catch(() => {})
  return <LinkButton onPress={share} label="Share contract">Share contract</LinkButton>
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginTop: 12, ...cardShadow },
  title: { fontSize: 16, fontWeight: '700', color: colors.kmNavy, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.kmLine },
  label: { fontSize: 13.5, color: colors.kmSub },
  value: { fontSize: 13.5, fontWeight: '600', color: colors.ink, flexShrink: 1, textAlign: 'right' },
  section: { fontSize: 12.5, fontWeight: '700', color: colors.kmNavy, marginTop: 12, marginBottom: 4 },
  item: { fontSize: 13.5, color: colors.ink, lineHeight: 19, marginBottom: 2 },
})
