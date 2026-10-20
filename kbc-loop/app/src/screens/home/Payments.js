// Laatste drie betalingen van de fictieve klant. Verrichtingen die een Kate-tip uitlokten krijgen een lichtblauwe
// achtergrond (zoals bij Axelle). "Verberg betalingen" klapt de lijst in (enkel UI-state).
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { Press } from '../../ui/Press.js'
import { Amount } from '../../ui/Amount.js'
import { Glyph } from './icons.js'
import { colors } from '../../theme.js'

const shortDate = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

export function Payments({ transactions, hotIds }) {
  const [open, setOpen] = useState(true)
  return (
    <View style={styles.wrap}>
      {open ? transactions.slice(0, 3).map((t) => (
        <View key={t.id} style={[styles.row, hotIds.includes(t.id) && styles.hot]}>
          <T style={styles.date}>{shortDate(t.date)}</T>
          <T style={styles.merchant} numberOfLines={1}>{t.merchant}</T>
          <Amount value={t.amount} style={styles.amount} />
        </View>
      )) : null}
      <Press style={styles.toggle} onPress={() => setOpen((v) => !v)} label={open ? 'Verberg betalingen' : 'Toon betalingen'}
        aria-expanded={open}>
        <Glyph name={open ? 'up' : 'down'} size={16} color={colors.kmBlue} strokeWidth={2} />
        <T style={styles.toggleText}>{open ? 'Verberg betalingen' : 'Toon betalingen'}</T>
      </Press>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8 },
  hot: { backgroundColor: '#e3f3fb' },
  date: { width: 38, color: colors.kmSub, fontSize: 11.5 },
  merchant: { flex: 1, fontSize: 15, color: colors.kmNavy },
  amount: { fontSize: 15 },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 12, alignSelf: 'flex-start', marginTop: 14, paddingHorizontal: 16, paddingVertical: 4 },
  toggleText: { color: colors.kmBlue, fontSize: 13, fontWeight: '700' },
})
