// "Your money at a glance": in & out for the current month (from the fictional customer's transactions)
// with a six-month bar chart. Earlier months are fictional, plausible values derived from the income.
// Not part of KBC Loop: Home shows it dimmed.
import { StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { Amount } from '../../ui/Amount.js'
import { Glyph } from './icons.js'
import { Dots, Section, shared } from './parts.js'
import { colors } from '../../theme.js'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
// Ratio to the monthly income for the five previous months (fictional, only for the chart).
const PAST_IN = [1, 1, 1.02, 1.48, 1]
const PAST_OUT = [0.78, 0.86, 1.1, 1.24, 0.81]
const CHART_H = 120

const COLORS = {
  inSoft: '#b9e3d8', inStrong: '#0f7a5c',
  outSoft: '#fbe9ad', outStrong: '#e2b600',
}

/** Income and expenses per month; the latest month comes straight from the transactions. */
export function monthlyInOut(transactions) {
  if (!transactions.length) return []
  const latest = transactions.reduce((m, t) => (t.date > m ? t.date : m), transactions[0].date)
  const ym = latest.slice(0, 7)
  const month = Number(latest.slice(5, 7)) - 1
  const current = transactions.filter((t) => t.date.startsWith(ym))
  const income = current.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const expense = -current.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0)
  const base = income || expense * 1.2
  const past = PAST_IN.map((f, i) => ({
    month: (month - PAST_IN.length + i + 12) % 12,
    income: base * f,
    expense: base * PAST_OUT[i],
  }))
  return [...past, { month, income, expense, current: true }]
}

function Total({ kind, label, value }) {
  const isIn = kind === 'in'
  return (
    <View style={styles.total}>
      <View style={[styles.totalIcon, { backgroundColor: isIn ? COLORS.inStrong : COLORS.outStrong }]}>
        <Glyph name="coins" size={24} color="#fff" strokeWidth={1.5} />
        <T style={styles.sign}>{isIn ? '+' : '−'}</T>
      </View>
      <View>
        <T style={styles.totalLabel}>{label}</T>
        <Amount value={value} style={styles.totalAmount} />
      </View>
    </View>
  )
}

function Bars({ data }) {
  const max = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1)
  const h = (v) => Math.max(3, (v / max) * CHART_H)
  return (
    <View>
      <View style={styles.chart} accessibilityLabel="Income and expenses per month">
        {data.map((d) => (
          <View key={d.month} style={styles.pair}>
            <View style={[styles.bar, { height: h(d.income), backgroundColor: d.current ? COLORS.inStrong : COLORS.inSoft }]} />
            <View style={[styles.bar, { height: h(d.expense), backgroundColor: d.current ? COLORS.outStrong : COLORS.outSoft }]} />
          </View>
        ))}
      </View>
      <View style={styles.axis} />
      <View style={styles.labels}>
        {data.map((d) => <T key={d.month} style={[styles.month, d.current && styles.monthNow]}>{MONTHS[d.month]}</T>)}
      </View>
    </View>
  )
}

export function MoneyOverview({ transactions }) {
  const data = monthlyInOut(transactions)
  const now = data[data.length - 1]
  if (!now) return null
  return (
    <Section title="Your money at a glance" link="Show all">
      <View style={[shared.card, styles.card]}>
        <Dots style={styles.dots} />
        <View style={styles.headRow}>
          <T style={styles.head}>In & out</T>
          <T style={styles.headMonth}>{MONTHS_LONG[now.month]}</T>
        </View>
        <View style={styles.totals}>
          <Total kind="in" label="Income" value={now.income} />
          <Total kind="out" label="Expenses" value={now.expense} />
        </View>
        <Bars data={data} />
      </View>
    </Section>
  )
}

const styles = StyleSheet.create({
  card: { paddingTop: 16, paddingHorizontal: 16, paddingBottom: 14 },
  dots: { position: 'absolute', top: 10, right: 12 },
  headRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  head: { fontSize: 16, fontWeight: '600' },
  headMonth: { fontSize: 14, color: colors.kmSub },
  totals: { flexDirection: 'row', marginTop: 14 },
  total: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  totalIcon: { width: 40, height: 40, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  sign: { position: 'absolute', top: 1, right: 4, color: '#fff', fontSize: 11, fontWeight: '700' },
  totalLabel: { fontSize: 15, color: colors.kmSub },
  totalAmount: { fontSize: 14, fontWeight: '600' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: CHART_H, marginTop: 18 },
  pair: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  bar: { width: 7, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  axis: { height: 2, backgroundColor: '#e9f1f7', borderRadius: 1 },
  labels: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  month: { fontSize: 13, color: colors.kmSub, width: 36, textAlign: 'center' },
  monthNow: { fontWeight: '700', color: colors.kmNavy },
})
