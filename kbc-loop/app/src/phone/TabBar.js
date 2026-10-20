// Zwevende menubalk met de vijf tabbladen van KBC Mobile. Niet-actieve tabbladen staan lichtgrijs.
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '../ui/Icon.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { TABS } from '../navigation.js'
import { colors } from '../theme.js'

export const TABBAR_HEIGHT = 64

export function TabBar({ active, onSelect }) {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.tabbar, { bottom: Math.max(insets.bottom, 12) }]} role="tablist">
      {TABS.map((t) => {
        const on = active === t.id
        const color = t.disabled ? colors.offIcon : colors.kmNavy
        return (
          <Press key={t.id} role="tab" aria-selected={on} label={t.label}
            onPress={t.disabled ? undefined : () => onSelect(t.id)} style={[styles.tab, on && styles.on]}>
            <Icon name={t.icon} size={22} color={color} fill={on ? colors.kmNavy : 'none'} />
            <T style={[styles.label, { color }, on && styles.labelOn]}>{t.label}</T>
          </Press>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute', left: 10, right: 10, flexDirection: 'row', gap: 2, padding: 6, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.96)', boxShadow: '0px 6px 22px rgba(18, 40, 76, 0.16)', zIndex: 4,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3, paddingTop: 7, paddingBottom: 6, borderRadius: 20 },
  on: { backgroundColor: '#eceff3' },
  label: { fontSize: 11, fontWeight: '600' },
  labelOn: { fontWeight: '800' },
})
