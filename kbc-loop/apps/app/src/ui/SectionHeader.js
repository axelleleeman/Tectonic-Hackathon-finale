// Section heading with an optional leading visual (e.g. Kate's avatar) and a right-aligned value or action.
import { StyleSheet, View } from 'react-native'
import { T } from './T.js'
import { colors } from '../theme.js'
import { font, space, tabular } from './tokens.js'

export function SectionHeader({ title, leading, right, style }) {
  return (
    <View style={[styles.row, style]}>
      {leading}
      <T style={styles.title} role="heading" numberOfLines={1}>{title}</T>
      {typeof right === 'string' ? <T style={styles.right}>{right}</T> : right ?? null}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginBottom: space.sm },
  title: { ...font.section, flex: 1, color: colors.kmNavy },
  right: { ...font.caption, ...tabular, fontWeight: '600', color: colors.kmSub },
})
