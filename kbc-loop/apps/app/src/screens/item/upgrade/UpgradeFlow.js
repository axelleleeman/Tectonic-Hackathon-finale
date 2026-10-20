// "Upgrade": choose a newer model → review (old vs new, coins for returning the old one, delivery date)
// → confirm. Confirming dispatches UPGRADE_ITEM; the shared reducer returns the old item, adds the new one
// and opens its product detail, where UpgradeSuccess is shown first (see ItemScreen).
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { upgradeQuote } from '@kbc-loop/shared/engine/upgrades.js'
import { T } from '../../../ui/T.js'
import { useFlowChrome } from '../chrome.js'
import { ActionButton, Card, StepProgress, StepTitle, SummaryRow } from '../parts.js'
import { ProductArt } from '../ProductArt.js'
import { Glyph } from '../Glyph.js'
import { UpgradeOption } from './UpgradeOption.js'
import { addDays, dateText, money, signedMoney, today } from '../format.js'
import { colors } from '../../../theme.js'

const DELIVERY_DAYS = 7
const LABELS = ['Choose a model', 'Review']

function Swap({ from, to }) {
  return (
    <View style={styles.swap} accessible aria-label={`From ${from.name} at ${money(from.monthly)} per month to ${to.name} at ${money(to.monthly)} per month`}>
      <View style={styles.side}>
        <ProductArt product={from} size="lg" style={styles.faded} />
        <T style={styles.sideLabel}>Now</T>
        <T style={styles.sideName} numberOfLines={2}>{from.name}</T>
        <T style={styles.sidePrice}>{money(from.monthly)}/month</T>
      </View>
      <View style={styles.arrow}><Glyph name="chevron" size={22} color={colors.kmBlue} strokeWidth={2.4} /></View>
      <View style={styles.side}>
        <ProductArt product={to} size="lg" />
        <T style={[styles.sideLabel, styles.newLabel]}>New</T>
        <T style={styles.sideName} numberOfLines={2}>{to.name}</T>
        <T style={styles.sidePrice}>{money(to.monthly)}/month</T>
      </View>
    </View>
  )
}

export function UpgradeFlow({ item, product, options, actions, onExit, onUpgrading }) {
  const [step, setStep] = useState(0)
  const [choice, setChoice] = useState(options[0]?.id ?? null)
  const target = options.find((o) => o.id === choice)
  const quote = target ? upgradeQuote(product.id, target.id) : null

  useFlowChrome({ title: 'Upgrade', stepKey: `upgrade-${step}`, onBack: () => (step > 0 ? setStep(step - 1) : onExit()) })

  const confirm = () => {
    onUpgrading(item.key)
    actions.upgradeItem(item.key, target.id)
  }

  return (
    <>
      <StepProgress step={step + 1} total={LABELS.length} label={LABELS[step]} />
      {step === 0 ? (
        <>
          <StepTitle title="Choose a model" />
          <View role="radiogroup" aria-label="Upgrade options">
            {options.map((o) => (
              <UpgradeOption key={o.id} option={o} quote={upgradeQuote(product.id, o.id)} selected={choice === o.id} onPress={() => setChoice(o.id)} />
            ))}
          </View>
          <ActionButton onPress={() => setStep(1)} disabled={!target}>Continue</ActionButton>
        </>
      ) : null}
      {step === 1 && target && quote ? (
        <>
          <StepTitle title="Review" />
          <Swap from={product} to={target} />
          <Card style={styles.summary}>
            <SummaryRow label="New monthly fee" value={`${money(target.monthly)}/month`} strong />
            <SummaryRow label="Difference" value={`${signedMoney(quote.monthlyDifference)}/month`} />
            <SummaryRow label="Delivery" value={dateText(addDays(today, DELIVERY_DAYS))} />
            <SummaryRow label="Kate Coins" value={`+${quote.coinsForReturn}`} strong last />
          </Card>
          <ActionButton onPress={confirm} label={`Confirm upgrade to ${target.name}`}>Confirm upgrade</ActionButton>
        </>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  swap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  side: { flex: 1, alignItems: 'center' },
  faded: { opacity: 0.6 },
  arrow: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.kmSky, alignItems: 'center', justifyContent: 'center', marginBottom: 50 },
  sideLabel: { marginTop: 10, fontSize: 11.5, fontWeight: '800', color: colors.kmGrey, textTransform: 'uppercase', letterSpacing: 0.6 },
  newLabel: { color: colors.kmBlue },
  sideName: { fontWeight: '700', fontSize: 14, textAlign: 'center', marginTop: 3 },
  sidePrice: { color: colors.kmSub, fontSize: 13, marginTop: 2 },
  summary: { marginTop: 18, paddingVertical: 6 },
  fine: { fontSize: 12, color: colors.kmGrey, textAlign: 'center', marginTop: 12 },
})
