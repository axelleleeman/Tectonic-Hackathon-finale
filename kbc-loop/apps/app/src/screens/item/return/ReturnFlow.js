// "Return": optional reason → pickup slot → summary → confirm (RETURN_ITEM) → success.
// The reason and slot are fictional demo choices and stay on this screen; the shared state records the return.
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { COINS } from '@kbc-loop/shared/config/index.js'
import { T } from '../../../ui/T.js'
import { useFlowChrome } from '../chrome.js'
import { ActionButton, Card, ChoiceRow, Note, StepProgress, StepTitle, SuccessHeader, SummaryRow } from '../parts.js'
import { Glyph } from '../Glyph.js'
import { addDays, dateText, today } from '../format.js'
import { colors } from '../../../theme.js'

const REASONS = ['I no longer need it', 'I am moving house', 'I want a different product', 'It does not meet my needs', 'Other reason']
const SLOTS = [
  { id: 's1', date: addDays(today, 2), time: '9 am – 12 pm' },
  { id: 's2', date: addDays(today, 3), time: '1 pm – 5 pm' },
  { id: 's3', date: addDays(today, 6), time: '9 am – 12 pm' },
]
const LABELS = ['Reason', 'Pickup', 'Summary']
const slotText = (s) => `${dateText(s.date, { weekday: true })}, ${s.time}`

export function ReturnFlow({ item, product, partner, cost, actions, onExit }) {
  const [step, setStep] = useState(item.returned ? 3 : 0)
  const [reason, setReason] = useState(null)
  const [slotId, setSlotId] = useState(SLOTS[0].id)
  const slot = SLOTS.find((s) => s.id === slotId)
  const done = step === 3

  useFlowChrome({
    title: done ? 'Return confirmed' : 'Return',
    stepKey: `return-${step}`,
    onBack: () => (step > 0 && !done ? setStep(step - 1) : onExit()),
  })

  const confirm = () => { actions.returnItem(item.key); setStep(3) }

  if (done) {
    return (
      <>
        <SuccessHeader title="Return confirmed" text={`Pickup ${slotText(slot)}`} />
        <View style={styles.coins} accessible aria-label={`${COINS.return} Kate Coins added to your balance`}>
          <View style={styles.coin}><T style={styles.coinK}>K</T></View>
          <T style={styles.coinsText}>+{COINS.return} Kate Coins added</T>
        </View>
        <ActionButton onPress={onExit}>Done</ActionButton>
      </>
    )
  }

  return (
    <>
      <StepProgress step={step + 1} total={LABELS.length} label={LABELS[step]} />
      {step === 0 ? (
        <>
          <StepTitle title="Reason (optional)" />
          <View role="radiogroup" aria-label="Reason for return">
            {REASONS.map((r) => <ChoiceRow key={r} title={r} selected={reason === r} onPress={() => setReason(reason === r ? null : r)} />)}
          </View>
          <ActionButton onPress={() => setStep(1)}>{reason ? 'Continue' : 'Skip'}</ActionButton>
        </>
      ) : null}
      {step === 1 ? (
        <>
          <StepTitle title="Pickup" />
          <View role="radiogroup" aria-label="Pickup slot">
            {SLOTS.map((s) => (
              <ChoiceRow key={s.id} title={dateText(s.date, { weekday: true })} sub={s.time} selected={slotId === s.id} onPress={() => setSlotId(s.id)}
                label={`Pickup on ${slotText(s)}`}
                left={<View style={styles.slotIcon}><Glyph name="truck" size={20} color={colors.kmBlue} /></View>} />
            ))}
          </View>
          <ActionButton onPress={() => setStep(2)}>Continue</ActionButton>
        </>
      ) : null}
      {step === 2 ? (
        <>
          <StepTitle title="Review" />
          <Card style={styles.card}>
            <SummaryRow label="Product" value={product.name} />
            <SummaryRow label="Reason" value={reason ?? 'Not given'} />
            <SummaryRow label="Pickup" value={slotText(slot)} />
            <SummaryRow label="Cost" value="€ 0" />
            <SummaryRow label="Kate Coins" value={`+${COINS.return}`} strong last />
          </Card>
          <Note>Materials get a second life.</Note>
          <ActionButton onPress={confirm} label={`Confirm return of ${product.name}`}>Confirm return</ActionButton>
        </>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  card: { paddingVertical: 6 },
  slotIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.kmSky, alignItems: 'center', justifyContent: 'center' },
  coins: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 16, backgroundColor: '#fff9e6', borderRadius: 99, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'center', borderWidth: 1, borderColor: '#f6e2a6' },
  coin: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f2b705', alignItems: 'center', justifyContent: 'center' },
  coinK: { color: '#0b3466', fontWeight: '900', fontSize: 13 },
  coinsText: { fontWeight: '800', fontSize: 15 },
})
