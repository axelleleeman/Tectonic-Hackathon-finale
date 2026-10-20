// Floating white tab bar with the five KBC Mobile tabs (shared with the web via @kbc-loop/shared/navigation/tabs.js).
// The active tab gets a light-grey rounded highlight and a filled icon.
// Invest and Business do nothing in the demo and are shown light grey.
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '../ui/Icon.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { TABS, screenForTab } from '../navigation.js'
import { colors } from '../theme.js'

export const TABBAR_HEIGHT = 64

/** Distance from the bottom of the screen to the tab bar. */
export function useTabBarBottom() {
  const insets = useSafeAreaInsets()
  return insets.bottom > 0 ? Math.max(insets.bottom - 12, 12) : 12
}

export function TabBar({ active, onSelect }) {
  const bottom = useTabBarBottom()
  return (
    <View style={[styles.tabbar, { bottom }]} role="tablist">
      {TABS.map((t) => {
        const on = active === t.id
        const color = t.disabled ? colors.offIcon : colors.kmNavy
        return (
          <Press key={t.id} role="tab" aria-selected={on} label={t.label}
            onPress={t.disabled ? undefined : () => onSelect(screenForTab(t.id))} style={[styles.tab, on && styles.on]}>
            {/* Outline icons (the loop symbol) get a bolder stroke when active instead of a fill */}
            <Icon name={t.icon} size={24} color={color}
              fill={on && !t.outline ? colors.kmNavy : 'none'} strokeWidth={on && t.outline ? 2.6 : 1.8} />
            <T style={[styles.label, { color }, on && styles.labelOn]} numberOfLines={1}>{t.label}</T>
          </Press>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute', left: 20, right: 20, height: TABBAR_HEIGHT, flexDirection: 'row', gap: 2, padding: 5, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.97)', borderWidth: 1, borderColor: '#e8ecf1',
    boxShadow: '0px 6px 22px rgba(18, 40, 76, 0.14)', zIndex: 4,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: 27 },
  on: { backgroundColor: '#e4e7eb' },
  label: { fontSize: 11.5, fontWeight: '600' },
  labelOn: { fontWeight: '800' },
})
