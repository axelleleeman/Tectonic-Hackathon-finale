// Kate Coins rewards: balance on top, rewards to redeem (confirm step + success state) and the redemption history.
// RewardsPanel is the body; it is shown both as the 'rewards' screen and as the Rewards segment of the Loop tab.
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { rewards, rewardById } from '@kbc-loop/shared/data/rewards.js'
import { num } from '@kbc-loop/shared/engine/format.js'
import { dateText } from '../item/format.js'
import { Icon } from '../../ui/Icon.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { EcoSurface } from '../../ui/EcoSurface.js'
import { cardShadow, colors } from '../../theme.js'

const ICONS = { 'fee-discount': 'piggy', 'plant-tree': 'heart', 'priority-repair': 'gear', 'free-upgrade': 'up' }
const iconFor = (r) => ICONS[r?.id] ?? 'sparkle'
const dateLabel = (iso) => { try { return dateText(iso, { withYear: false }) } catch { return iso } }

function Badge({ reward, done }) {
  return (
    <View style={[styles.badge, done && styles.badgeDone]}>
      <Icon name={iconFor(reward)} size={20} color={done ? colors.kmSub : colors.kmBlue} />
    </View>
  )
}

function SmallButton({ label, onPress, disabled, primary, a11y }) {
  return (
    <Press onPress={disabled ? undefined : onPress} label={a11y ?? label}
      style={[styles.btn, primary && styles.btnPrimary, disabled && styles.btnOff]}>
      <T style={[styles.btnText, primary && styles.btnTextPrimary, disabled && styles.btnTextOff]}>{label}</T>
    </Press>
  )
}

function Confirm({ step, coins, onConfirm, onCancel }) {
  const { reward, done, busy } = step
  return (
    <View style={[styles.card, styles.confirm]} accessibilityLiveRegion="polite">
      <T style={styles.confirmTitle}>{done ? `Redeemed: ${reward.title}` : `Redeem ${reward.title}?`}</T>
      <T style={styles.sub}>
        {done ? `You have ${num(coins)} Kate Coins left.` : `${num(reward.cost)} coins · ${num(coins - reward.cost)} left after`}
      </T>
      <View style={styles.confirmRow}>
        {done
          ? <SmallButton label="Done" primary onPress={onCancel} />
          : (
            <>
              <SmallButton label="Cancel" onPress={onCancel} />
              <SmallButton label="Confirm" primary disabled={busy} onPress={onConfirm} />
            </>
          )}
      </View>
    </View>
  )
}

export function RewardsPanel({ state, customer, coins = 0, actions, style }) {
  const [step, setStep] = useState(null)
  const history = [...(state?.redemptions?.[customer?.id] ?? [])].reverse()

  const confirm = async () => {
    const { reward } = step
    setStep({ reward, busy: true })
    await actions.redeemReward?.(reward.id)
    setStep({ reward, done: true })
  }

  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.card, styles.balance]} accessible accessibilityLabel={`Kate Coins balance: ${num(coins)}`}>
        <T style={styles.label}>Kate Coins</T>
        <T style={styles.balanceValue}>{num(coins)}</T>
        <T style={styles.sub}>Earn coins with every repair and return.</T>
      </View>

      {step ? <Confirm step={step} coins={coins} onConfirm={confirm} onCancel={() => setStep(null)} /> : null}

      <T style={styles.h}>Rewards</T>
      <View style={styles.card}>
        {rewards.map((r, i) => {
          const short = r.cost > coins
          const eco = r.id === 'plant-tree'
          const Row = eco ? EcoSurface : View
          return (
            <Row key={r.id} {...(eco ? { bordered: false } : {})} style={[styles.row, i > 0 && styles.rowLine]}>
              <Badge reward={r} />
              <View style={styles.text}>
                <T style={styles.title}>{r.title}</T>
                <T style={styles.sub}>{num(r.cost)} coins{short ? ` · ${num(r.cost - coins)} to go` : ''}</T>
              </View>
              <SmallButton label="Redeem" disabled={short} onPress={() => setStep({ reward: r })}
                a11y={`Redeem ${r.title} for ${r.cost} Kate Coins`} />
            </Row>
          )
        })}
      </View>

      <T style={styles.h}>Redeemed</T>
      {history.length ? (
        <View style={styles.card}>
          {history.map((h, i) => {
            const r = rewardById(h.rewardId)
            return (
              <View key={h.id} style={[styles.row, i > 0 && styles.rowLine]}>
                <Badge reward={r} done />
                <View style={styles.text}>
                  <T style={styles.title}>{r?.title ?? 'Reward'}</T>
                  <T style={styles.sub}>{dateLabel(h.on)}</T>
                </View>
                <T style={styles.sub}>− {num(r?.cost ?? 0)}</T>
              </View>
            )
          })}
        </View>
      ) : <T style={styles.sub}>Nothing redeemed yet.</T>}
    </View>
  )
}

export function RewardsScreen(props) {
  return <RewardsPanel {...props} />
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, ...cardShadow },
  balance: { padding: 18 },
  label: { fontSize: 13, color: colors.kmSub, fontWeight: '600' },
  balanceValue: { fontSize: 44, fontWeight: '700', letterSpacing: -1, color: colors.kmBlue, marginTop: 2 },
  h: { fontSize: 16, fontWeight: '700', marginTop: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  rowLine: { borderTopWidth: 1, borderTopColor: colors.kmLine },
  badge: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.kmSky, alignItems: 'center', justifyContent: 'center' },
  badgeDone: { backgroundColor: '#f0f3f6' },
  text: { flex: 1, minWidth: 0 },
  title: { fontSize: 15, fontWeight: '600' },
  sub: { fontSize: 13, color: colors.kmSub, marginTop: 2 },
  btn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 99, borderWidth: 1.5, borderColor: colors.button },
  btnPrimary: { backgroundColor: colors.button },
  btnOff: { borderColor: colors.kmLine },
  btnText: { fontSize: 14, fontWeight: '600', color: colors.button },
  btnTextPrimary: { color: '#fff' },
  btnTextOff: { color: colors.kmGrey },
  confirm: { padding: 16, borderWidth: 1.5, borderColor: colors.kmBlue },
  confirmTitle: { fontSize: 16, fontWeight: '700' },
  confirmRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 },
})
