// "Costs & contract" for one borrowed item: monthly fee split, contract progress, payments,
// saving versus buying and the services included. All figures come from the shared itemCosts engine.
import { StyleSheet, View } from 'react-native'
import { productServices } from '@kbc-loop/shared/engine/integrations.js'
import { ServiceChips } from '../../ui/ServiceChips.js'
import { T } from '../../ui/T.js'
import { useFlowChrome } from '../item/chrome.js'
import { Card, SectionLabel, StepTitle, SummaryRow } from '../item/parts.js'
import { Glyph } from '../item/Glyph.js'
import { dateText, money, plural } from '../item/format.js'
import { SPLIT_COLORS, SplitBar } from './SplitBar.js'
import { StatGrid } from './StatGrid.js'
import { colors } from '../../theme.js'

function ContractProgress({ cost }) {
  const share = Math.min(1, cost.monthsActive / cost.termMonths)
  return (
    <View accessible aria-label={`Contract: ${cost.monthsActive} of ${cost.termMonths} months`}>
      <View style={styles.progressHead}>
        <T style={styles.progressLabel}>{dateText(cost.since)}</T>
        <T style={styles.progressLabel}>{dateText(cost.endDate)}</T>
      </View>
      <View style={styles.track}><View style={[styles.fill, { width: `${Math.max(share * 100, 2)}%` }]} /></View>
      <T style={styles.progressText}>{cost.monthsActive} of {cost.termMonths} months</T>
    </View>
  )
}

export function ItemCostDetail({ item, product, partner, cost, customer, onExit }) {
  useFlowChrome({ title: 'Costs & contract', stepKey: 'costs', onBack: onExit })
  if (!cost) return <T>No cost details are available for this product.</T>
  const returned = cost.status === 'returned'
  const parts = [
    { key: 'partner', label: partner.name, value: cost.split.partner, color: SPLIT_COLORS.partner },
    { key: 'insurance', label: 'Insurance', value: cost.split.insurance, color: SPLIT_COLORS.insurance },
    { key: 'kbc', label: 'KBC', value: cost.split.kbc, color: SPLIT_COLORS.kbc },
  ]
  const borrowTotal = cost.monthly * cost.termMonths

  return (
    <>
      <StepTitle title={product.name} />

      <Card>
        <View style={styles.feeHead}>
          <T style={styles.feeLabel}>Monthly fee</T>
          <T style={styles.fee}>{money(cost.monthly)}<T style={styles.per}> /month</T></T>
        </View>
        <SplitBar parts={parts} total={cost.monthly} />
      </Card>

      <SectionLabel>Contract</SectionLabel>
      <Card><ContractProgress cost={cost} /></Card>
      <View style={styles.gap} />
      <StatGrid stats={[
        { label: 'Paid to date', value: money(cost.paidToDate) },
        { label: 'Remaining', value: returned ? 'None' : plural(cost.remainingMonths, 'month') },
        { label: returned ? 'Returned on' : 'Ends on', value: dateText(returned ? item.returnedOn : cost.endDate) },
        { label: 'Next payment', value: cost.nextPaymentDate ? dateText(cost.nextPaymentDate) : 'None' },
      ]} />

      <SectionLabel>Versus buying</SectionLabel>
      <Card>
        <SummaryRow label="Buying" value={money(cost.buyEquivalent)} />
        <SummaryRow label="Borrowing" value={money(borrowTotal)} />
        <SummaryRow label={cost.savingVsBuying >= 0 ? 'You save' : 'Extra for full service'} value={money(Math.abs(cost.savingVsBuying))}
          tone={cost.savingVsBuying >= 0 ? 'green' : undefined} strong last />
      </Card>

      <SectionLabel>Included</SectionLabel>
      <Card>
        {product.includes.map((i) => (
          <View key={i} style={styles.include}>
            <Glyph name="check" size={16} color={colors.green} strokeWidth={2.6} />
            <T style={styles.includeText}>{i}</T>
          </View>
        ))}
      </Card>
      <SectionLabel>Arranged by KBC</SectionLabel>
      <Card>
        <ServiceChips services={productServices(product, customer.type)} withRole />
      </Card>
    </>
  )
}

const styles = StyleSheet.create({
  feeHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 },
  feeLabel: { fontSize: 14, color: colors.kmSub, fontWeight: '600' },
  fee: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  per: { fontSize: 13, fontWeight: '500', color: colors.kmSub },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 12.5, color: colors.kmSub, fontWeight: '600' },
  track: { height: 10, borderRadius: 5, backgroundColor: colors.kmLine, marginTop: 8, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5, backgroundColor: colors.kmBlue },
  progressText: { fontSize: 13, marginTop: 8, fontWeight: '600' },
  gap: { height: 10 },
  include: { flexDirection: 'row', gap: 10, paddingVertical: 5, alignItems: 'flex-start' },
  includeText: { flex: 1, fontSize: 14, lineHeight: 19 },
  servicesTitle: { fontWeight: '700', fontSize: 14, marginBottom: 10 },
})
