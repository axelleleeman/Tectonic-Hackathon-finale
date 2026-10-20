// Bedrag zoals in KBC Mobile: "2 483,17 EUR" met kleinere decimalen.
import { StyleSheet } from 'react-native'
import { T } from './T.js'

export function Amount({ value, unit = 'EUR', style }) {
  const [int, dec] = Math.abs(value).toFixed(2).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  const size = StyleSheet.flatten(style)?.fontSize ?? 15
  const smaller = { fontSize: Math.round(size * 0.78) }
  return (
    <T style={[styles.amount, style]} numberOfLines={1}>
      {value < 0 ? '-' : ''}{grouped}<T style={[style, smaller]}>,{dec}</T> <T style={[style, smaller, styles.unit]}>{unit}</T>
    </T>
  )
}

const styles = StyleSheet.create({
  amount: { flexShrink: 0 },
  unit: { fontWeight: '600' },
})
