// Cost overview (screen 'costs'): monthly total, next payment, paid to date, saving versus buying,
// breakdown by category, every product with its fee (tap → product detail) and the next 6 payments.
// All figures come from the shared costOverview engine, so web and app show the same numbers.
import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { costOverview } from '@kbc-loop/shared/engine/costs.js'
import { T } from '../../ui/T.js'
import { Card, ActionButton, SectionLabel } from '../item/parts.js'
import { dateText, money } from '../item/format.js'
import { CategoryBars, CostItemRow, UpcomingPayments } from './CostParts.js'
import { colors } from '../../theme.js'

function Hero({ o }) {
  const label = `Monthly total ${money(o.monthlyTotal)}. Next payment ${o.nextPaymentDate ? dateText(o.nextPaymentDate) : 'none'}. `
    + `Paid to date ${money(o.paidToDate)}. Saving versus buying ${money(o.savingVsBuying)}.`
  return (
    <LinearGradient colors={['#0e4f8c', '#0b3466']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
      <View accessible aria-label={label}>
        <T style={styles.heroLabel}>Monthly total</T>
        <T style={styles.heroValue}>{money(o.monthlyTotal)}<T style={styles.heroPer}> /month</T></T>
        <T style={styles.heroSub}>
          {o.nextPaymentDate ? `Next payment ${dateText(o.nextPaymentDate)}` : 'No upcoming payments'}
        </T>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <T style={styles.heroStatLabel}>Paid to date</T>
            <T style={styles.heroStatValue}>{money(o.paidToDate)}</T>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroStat}>
            <T style={styles.heroStatLabel}>Saving vs buying</T>
            <T style={[styles.heroStatValue, styles.heroGreen]}>{money(o.savingVsBuying)}</T>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

export function CostOverview({ items, actions }) {
  const o = costOverview(items)
  const open = (itemKey) => actions.navigate('item', { itemKey })

  if (o.items.length === 0) {
    return (
      <>
        <Hero o={o} />
        <ActionButton onPress={() => actions.navigate('shop')}>Discover KBC Loop</ActionButton>
      </>
    )
  }

  return (
    <>
      <Hero o={o} />

      {o.byCategory.length ? (
        <>
          <SectionLabel>By category</SectionLabel>
          <Card><CategoryBars categories={o.byCategory} /></Card>
        </>
      ) : null}

      <SectionLabel>Products</SectionLabel>
      <Card style={styles.list}>
        {o.items.map((c, n) => <CostItemRow key={c.itemKey} cost={c} onPress={() => open(c.itemKey)} last={n === o.items.length - 1} />)}
      </Card>

      <SectionLabel>Upcoming</SectionLabel>
      <Card style={styles.list}><UpcomingPayments upcoming={o.upcoming} /></Card>

    </>
  )
}

const styles = StyleSheet.create({
  hero: { borderRadius: 20, padding: 20, overflow: 'hidden' },
  heroLabel: { color: '#bfe3f7', fontSize: 13.5, fontWeight: '700' },
  heroValue: { color: '#fff', fontSize: 40, fontWeight: '800', letterSpacing: -1, marginTop: 4 },
  heroPer: { color: '#bfe3f7', fontSize: 16, fontWeight: '600', letterSpacing: 0 },
  heroSub: { color: '#e3f3fb', fontSize: 14, marginTop: 4 },
  heroStats: { flexDirection: 'row', marginTop: 18, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingVertical: 12 },
  heroStat: { flex: 1, alignItems: 'center' },
  heroDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  heroStatLabel: { color: '#bfe3f7', fontSize: 12.5, fontWeight: '600' },
  heroStatValue: { color: '#fff', fontSize: 19, fontWeight: '800', marginTop: 4 },
  heroGreen: { color: '#7de8b8' },
  list: { paddingVertical: 4 },
})
